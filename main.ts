const CLIENT_ID = ""
const CLIENT_SECRET = ""
const CLIENT_REDIRECT = "http://127.0.0.1:5566/callback"

const port = 5566
const hostname = "127.0.0.1"
import { serve, Response } from "https://deno.land/std@0.104.0/http/server.ts";
const server = serve({ port: port, hostname: hostname });


async function main(request:any){
    let response:Response = {}


    console.log(request.url)

    if(request.url == "/login"){
        const redirect = encodeURIComponent(CLIENT_REDIRECT);
        console.log(redirect)
        let url = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirect}&response_type=code&scope=identify%20email%20guilds`
    
        response.body = `<a href="${url}">Login</a>`
    
    } else if(request.url.startsWith("/callback")){
        const code = request.url.split("=")[1]
        const redirect = encodeURIComponent(CLIENT_REDIRECT);
        const url = `https://discordapp.com/api/oauth2/token`

        console.log(url)
        let authToken = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);

        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('code', code);
        params.append('redirect_uri', CLIENT_REDIRECT);
        params.append("client_id", CLIENT_ID);
        params.append("client_secret", CLIENT_SECRET);

        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Basic ${authToken}`, 
                'Accept': 'application/json'
            },
            body: params
        })
    
        const json = await res.text()
        console.log(json)
        response.body = json
    } else if(request.url == "/info"){
        let req = await fetch("https://discordapp.com/api/users/@me", {
            headers: {
                "Authorization": `Bearer VALUE`
            }
        })
        let json = await req.json()
        response.body = JSON.stringify(json)
    } else if(request.url == "/guild"){
        let req = await fetch("https://discordapp.com/api/users/@me/guilds", {
            headers: {
                "Authorization": `Bearer VALUE`
            }
        })
        let json = await req.json()
        response.body = JSON.stringify(json)
    }

    request.respond(response)
}

for await (const request of server) {
    if(["POST", "GET"].includes(request.method)){
        main(request)
    } else {
        request.respond({ status: 418 })
    }
}

