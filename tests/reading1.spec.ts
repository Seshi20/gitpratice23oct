import{test , expect} from 'playwright/test'

import myexcel from 'xlsx'

test(" read excel", async({page})=>{

function readExcel(fpath : string , sname : string)
{

    const wk : any = myexcel.readFile(fpath)

    const ws = wk.Sheets[sname];
    const edata= myexcel.utils.sheet_to_json(ws,{header : 1});
    return edata;

}
//await page.waitForTimeout(3000);
console.log(readExcel('./empinfo/empnames.xlsx','morning'));
    


})
