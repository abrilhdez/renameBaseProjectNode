(function () {
    'use strict';
    var fs = require('fs');
    var clone = require('gh-clone');
    var readlineSync = require('readline-sync');
    var replace = require('replace-in-file');
    var userName = readlineSync.question('Ingrese usuario: ');
    const repo = 'http://' + userName + '@devtools.certum.com/bitbucket/scm/axity/etc-swd.git';

    var nameProyect =  readlineSync.question('Ingrese el nombre del proyecto: ');

    var branch = readlineSync.question('Ingrese el nombre del branch: ');

    var dir = __dirname;
    var dest = `${__dirname}\\${nameProyect}`;

    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest);

        clone(repo, { dest: dest, branch: branch }, function () {
            fRenameTexts();
            fRenameFiles();
            fRenameFolders();
        });
    }
    else {
        return console.error(`Problem creating directory: ${dest}`)
    }


    function fRenameFolders() {
        var folders = `${dir}\\rename-config\\folders-rename.json`;
        var foldersJson = JSON.parse(fs.readFileSync(folders, 'utf8'));


        foldersJson.forEach(element => {
            var oldFile = dest + element.Path + element.Folder;
            var newFile = dest + element.Path + nameProyect;
            
            fs.renameSync(oldFile, newFile);
            console.log( `Rename complete: ${newFile}`);
        });
    }

    function fRenameTexts() {
        let texts = `${dir}\\rename-config\\texts-rename.json`;
        let textsJson = JSON.parse(fs.readFileSync(texts, 'utf8'));

        textsJson.forEach(element => {
            let fullPath = dest + element.Path + element.File;
            const options = {
                files: fullPath,
                from: RegExp(element.Text, 'g'),
                to: nameProyect,
            };
            
            let resp = replace.sync(options);
            console.log(`Replace text complete: ${resp}`);
        });
    }

    function fRenameFiles() {
        var files = `${dir}\\rename-config\\files-rename.json`;
        var filesJson = JSON.parse(fs.readFileSync(files, 'utf8'));

        filesJson.forEach(element => {
            var str = element.File;
            var newstr = str.replace(RegExp(element.Text, 'g'), nameProyect);
            var oldFile = dest + element.Path + str;
            var newFile = dest + element.Path + newstr;
            
            fs.renameSync(oldFile, newFile);
            console.log( `Rename complete: ${newFile}`);
        });
    }
    
}())


