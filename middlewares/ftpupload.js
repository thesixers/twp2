import { Client } from "basic-ftp";

let {FTPHOST, FTPUSER, FTPPASS} = process.env

export default async function uploadFileToFtp(file, remoteDir, remoteFileName) {
    const client = new Client();

    try {
        await client.access({
            host: FTPHOST,
            user: FTPUSER,
            password: FTPPASS,
            secure: false
        });

        console.log("Connected to FTP server");

        let url = `${remoteDir}/${remoteFileName}`;
        await client.ensureDir(remoteDir);

        if(Array.isArray(remoteFileName)){
            let urlArr = [];
            for(const urlObj of remoteFileName) {
                let {url, temp} = urlObj;
                await client.uploadFrom(temp, url);
                urlArr.push(`https://forestgreen-woodpecker-273365.hostingersite.com${url}`)
            }
            return urlArr
        }else{
            await client.uploadFrom(file.tempFilePath, url);
            return `https://forestgreen-woodpecker-273365.hostingersite.com${url}`
        }

    } catch (err) {
        return "Error uploading file to FTP server:", err
    } finally {
        client.close();
    }
}


export async function deleteFileFromFtp(dir) {
    const client = new Client();

    try {
        await client.access({
            host: "92.113.19.240",
            user: "u230430233.joe",
            password: "Thewebtoonprojectisthebest2468#",
            secure: false
        });

        console.log("Connected to FTP server");

        await client.removeDir(dir)
        console.log('file removed');
    } catch (err) {
        console.log(err);
    } finally {
        client.close();
    }
}
