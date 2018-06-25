(function () {
    'use strict';
    var fs = require('fs');
    var clone = require('gh-clone');
    var readlineSync = require('readline-sync');
    var replace = require('replace-in-file');

    var extProjectA = RegExp('[N]ame[Pp]roject', 'g');
    var extProjectB = RegExp('[n]ame[Pp]roject', 'g');

    var userName = readlineSync.question('Ingrese usuario: ');
    var repo = `http://${userName}@devtools.certum.com/bitbucket/scm/axity/etc-swd.git`;

    var nameProject = readlineSync.question('Ingrese el nombre del proyecto: ');
    var nameProjectA = nameProject.charAt(0).toUpperCase()+ (nameProject.slice(1, nameProject.length)).toLocaleLowerCase();
    var nameProjectB = nameProject.toLocaleLowerCase();

    var branch = readlineSync.question('Ingrese el nombre del branch: ');
    var dir = __dirname;
    var dest = `${__dirname}\\${nameProjectA}`;
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
        console.log('----- RENAME FOLDERS -----');

        let folders = `${dir}\\rename-config\\folders-rename.json`;
        let foldersJson = JSON.parse(fs.readFileSync(folders, 'utf8'));

        foldersJson.forEach(element => {
            let oldFile = `${dest}${element.Path}${element.Folder}`;
            let newFile = `${dest}${element.Path}${nameProjectA}`;

            fs.renameSync(oldFile, newFile);
            console.log(`Rename folder complete: ${newFile}`);
        });
    }

    function fRenameTexts() {

        console.log('----- RENAME TEXTS -----');


        let texts = `${dir}\\rename-config\\texts-rename.json`;
        let textsJson = JSON.parse(fs.readFileSync(texts, 'utf8'));

        findAndReplaceText(textsJson, extProjectA, nameProjectA);
        findAndReplaceText(textsJson, extProjectB, nameProjectB);
    }

    function findAndReplaceText(textsJson, ext, nameProject) {
        textsJson.forEach(element => {
            let fullPath = `${dest}${element.Path}${element.File}`;
            const options = {
                files: fullPath,
                from: ext,
                to: nameProject,
            };

            let resp = replace.sync(options);
            console.info(`Replace text complete: ${resp}.`);
            console.info(`>> ${fullPath}`);
        });
    }

    function fRenameFiles() {
        let files = `${dir}\\rename-config\\files-rename.json`;
        let filesJson = JSON.parse(fs.readFileSync(files, 'utf8'));

        filesJson.forEach(element => {
            let str = element.File;

            let newstr = str.replace(extProjectA, nameProjectA);
            let oldFile = `${dest}${element.Path}${str}`;
            let newFile = `${dest}${element.Path}${newstr}`;

            fs.renameSync(oldFile, newFile);
            console.log(`Rename file complete: ${newFile}`);
        });
    }

}())


