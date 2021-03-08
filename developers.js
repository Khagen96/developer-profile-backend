const express = require('express');
const shortid = require('shortid');
const axios = require('axios');
const router = express.Router();
//router.use(express.static('public'));

const [all_developers]= require("./dev_data");

router.get("/",(req,res)=>{
    const dev=[]
    all_developers.forEach(item=> {
        dev.push({id: item.id, avatar_url: item.avatar_url});
      })
    res.status(200).send(dev);
});

router.post("/",(req,res)=>{
    const github_id = req.body.github_id;
    const linkedin_id = req.body.linkedin_id;
    const codechef_id = req.body.codechef_id;
    const hackerrank_id = req.body.hackerrank_id;
    const twitter_id = req.body.twitter_id;
    const medium_id = req.body.medium_id;
    const developers = {};
    const getUser = axios(`https://api.github.com/users/${github_id}`);
    const getRepos = axios(`https://api.github.com/users/${github_id}/repos`);

    Promise.all([getUser,getRepos])
    .then(allResponse=>{
        developers.id = github_id;
        developers.avatar_url = allResponse[0].data["avatar_url"];
        developers.name = allResponse[0].data["name"];
        developers.company = allResponse[0].data["company"];
        developers.blog = allResponse[0].data["blog"];
        developers.location = allResponse[0].data["location"];
        developers.email = allResponse[0].data["email"];
        developers.bio = allResponse[0].data["bio"];
        developers.github_id = github_id ;
        developers.linkedin_id = linkedin_id;
        developers.codechef_id = codechef_id;
        developers.hackerrank_id = hackerrank_id;
        developers.twitter_id = twitter_id;
        developers.medium_id = medium_id ;
        developers.repos=[]

        const repoData = allResponse[1].data;
        repoData.forEach(element => {
            developers.repos.push({ 
                name: element["name"], 
                html_url: element["html_url"],
                description: element["description"],
                updated_at: element["updated_at"]  
            });
        });
        all_developers.push(developers);
        res.status(201).send({
            id: developers.id
        });
        })
        .catch(err =>{
            console.log(err)
            res.status(404).send(err)
        })
    }); 

router.get("/:id",(req,res)=>{
        const id = req.params.id;
        var result = all_developers.find(dev_id => {
            return dev_id.id === id
          });
        if(result){
            res.status(200).send(result);
          }
        else
          res.status(404).send("user doesn't exist");
});

router.delete("/:id",(req,res)=>{
        const id = req.params.id;
        var removeIndex = all_developers.map(function(item) { return item.id; }).indexOf(id);
        all_developers.splice(removeIndex, 1);
        res.status(204).send("deleted sucessfully");
}); 
  
module.exports = router;