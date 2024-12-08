const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiUUp4SzlOMnRrb2FNQ2Vkc3BURDJwTkVJNHZzbllsOWtGbVFPV2F1bCtFcz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiN0tHQms5ajNYUExyN0x1ZFBKdGU1T3VmRlYwc0hiL3NLTnFCSkxGeHozcz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJLTGVKWGtzamRFOUJlMDcyYitMcElhbTFYVVltaWI5Tm83dTNTNlYrTldZPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJaZlJLb3pNZ0JTMkQxSlNUOGQzMUt4N1QxU2VFeEtvR1hyMXVZUWUxZ2djPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImdQWi9BeDN4Rlc4aUt6NHZmZE9JS0FIekVnZE1qRUxXbCtMbHJKeUlIa3c9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjJCbnBDVjhCWERoRURKYUd4MzhzWWp2UXBUSWs2bnRJSnkveklxK01laDA9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoid0NxaXoxcU40bUExTmNkOFp1WWxHZ0tweTNiM0ZwdExvR3laU3E2QWNtST0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNnhyTzJmL3RITWpieXpRNE5LdzRyZ1dBTzVNekVIQjk2V3dxUU4rdWlFdz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlFEeVI2cFNyeE8rRnZhZ2xodEh1ZFBGUmZMUWdHckx0YllOaEd2enYza1VwNnhvV1NYcjlDV3hhTSswMkRJTjQ4VktVMG41Kys1aVVjRmhRQmM2VmpnPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTUzLCJhZHZTZWNyZXRLZXkiOiJrMkY3M2V6ZTdwYnhyeEVMcGg0VlpiOUNUQnF0bGdtOGw2QWJob1BHNDhJPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJfWGZKREtkOFREU1BpUmdkVkVjcExnIiwicGhvbmVJZCI6IjY2MWYxOTM4LTllZDEtNGY2Yy04OGY1LTNhNTc1ZjdkY2U4NyIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJpUXBSbDFtNHRWdTBWclFrT1lvaDBiZEd5bEE9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiZ1VSVUUzU0U1SVczSnMzWUtzd0cwU0tvN0hBPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IjMxQkVDVlZNIiwibWUiOnsiaWQiOiIyMzQ4MDgxNTg1NTUzOjZAcy53aGF0c2FwcC5uZXQiLCJuYW1lIjoiR2VuZXNpcyJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDT3JPNXQ0Q0VMTzEyTG9HR0FFZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiN0JxQkVScFBtUzdWZkI5a0JudHl1Y3NOU254bmpzQnl0NHIzNENPZFZ3UT0iLCJhY2NvdW50U2lnbmF0dXJlIjoiTXFOQm9RSzRCckxhUTlCTDRCSFZDdk5kSURPZVFjTWxmNmJmNzZydmcvVEZMS210WGZONWJnYzVsTEU0K1ZzS3V2V1Z3MmFZWU1iL3lHR1dxOVlVQlE9PSIsImRldmljZVNpZ25hdHVyZSI6IjlZdDRNcFpoUi9aMzdTMHF6b0ZJUlYxOWdTYUhNdWVEWG5ibE0rMUoxWlczRmdqVXFsbzN6OVkvSGxiTVhZTHdLV2h0dTlWZnJNWWpoOTgra3oxWWpnPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjM0ODA4MTU4NTU1Mzo2QHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQmV3YWdSRWFUNWt1MVh3ZlpBWjdjcm5MRFVwOFo0N0FjcmVLOStBam5WY0UifX1dLCJwbGF0Zm9ybSI6InNtYmEiLCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3MzM2OTYxOTV9',
    PREFIXE: process.env.PREFIX || "+",
    GITHUB : process.env.GITHUB|| 'https://github.com/Keithkeizzah/ALPHA-MD1',
    OWNER_NAME : process.env.OWNER_NAME || "Keith",
    NUMERO_OWNER : process.env.NUMERO_OWNER || "2348081585553",  
    ANTILINK : process.env.ANTILINK || "yes",
    ANTI_VV : process.env.ANTI_VV || "no",               
    AUTO_REPLY : process.env.AUTO_REPLY || "no",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "no",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',
    AUTO_REACT: process.env.AUTO_REACTION || "non",  
    AUTO_LIKE_STATUS: process.env.AUTO_LIKE_STATUS || 'no',              
    CHATBOT: process.env.CHAT_BOT || "off",              
    AUTO_READ_MESSAGES: process.env.AUTO_READ_MESSAGES || "no",
    AUTO_BLOCK: process.env.BLOCK_ALL || 'yes',              
    GURL: process.env.GURL  || "https://whatsapp.com/channel/0029Vaan9TF9Bb62l8wpoD47",
    WEBSITE :process.env.GURL || "https://whatsapp.com/channel/0029Vaan9TF9Bb62l8wpoD47",
    CAPTION : process.env.CAPTION || "ALPHA-MD",
    BOT : process.env.BOT_NAME || 'ALPHA_MD',
    URL : process.env.BOT_MENU_LINKS || '',
    MODE: process.env.PUBLIC_MODE || "no",              
    TIMEZONE: process.env.TIMEZONE || "Africa/Nairobi", 
    PM_PERMIT: process.env.PM_PERMIT || 'no',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME || null,
    HEROKU_APY_KEY : process.env.HEROKU_APY_KEY || null,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || '',
    GEMINI_API_KEY : process.env.GEMINI_API_KEY || 'AIzaSyCcZqDMBa8FcAdBxqE1o6YYvzlygmpBx14',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'no',
    ANTICALL: process.env.ANTICALL || 'yes',              
    CHAT_BOT : process.env.CHAT_BOT || 'no',  
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9" : "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9",
    /* new Sequelize({
     dialect: 'sqlite',
     storage: DATABASE_URL,
     logging: false,
})
: new Sequelize(DATABASE_URL, {
     dialect: 'postgres',
     ssl: true,
     protocol: 'postgres',
     dialectOptions: {
         native: true,
         ssl: { require: true, rejectUnauthorized: false },
     },
     logging: false,
}),*/
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
