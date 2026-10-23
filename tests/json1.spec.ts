import{test , expect} from 'playwright/test'

import jsonread from 'fs'

test(" read json", async({page})=>{

    const movieinfo = JSON.parse(jsonread.readFileSync('./myfavjson/movies.json','utf-8'));


    console.log(movieinfo.name);
    console.log(movieinfo.gross);
    console.log(movieinfo.hero);
    console.log(movieinfo.heroine);
    console.log(movieinfo.lang);
})
