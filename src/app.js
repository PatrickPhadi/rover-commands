import http from 'http';
import formidable from 'formidable';
import Rover from './rover/Rover';
import { promises as fsPromises } from 'fs';

const rover = new Rover();

const port = process.env.PORT || 3000;

const server = http.createServer(function (req, res) {
    if (req.url == '/fileupload') {
        var form = new formidable.IncomingForm();
        form.parse(req);
        form.on('file', async (name, file) => {
            const data = await fsPromises.readFile(file.filepath, "utf-8");
            const arr = data.split('\n');
            // zone
            const zone = arr[0];
            // position
            const position = arr[1];
            // movements
            const movements = arr[2];

            rover.sendCommands({ zone, commands: [{ position, movements }] });
        });
    } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
        res.write('<input type="file" name="filetoupload"><br>');
        res.write('<input type="submit" value="Send commands">');
        res.write('</form>');
        return res.end();
    }
});

server.listen(port);
console.log('⚡️[server]: running on PORT:', port);