preload('three.js');

function main(){

    let classes={};
    for(let c in THREE)classes[c]=THREE[c];
    exportData(classes);
}