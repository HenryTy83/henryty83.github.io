// use for save/load files
function loadFile(filePath) {
    let result = null;
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status == 200)  result = xmlhttp.responseText;
    else {throw new Error(xmlhttp.status)}
    return result;
}

function saveFile(data='', name='file.txt', type='text/plain') {
    let file = new Blob([data], {type: type});
    let url = URL.createObjectURL(file)

    // bc i can't force download for spam reasons we gonna make a download link and force the user to click
    var downloadElement = document.createElement('a')
    document.body.appendChild(downloadElement)
    downloadElement.href = url
    downloadElement.download = name
    downloadElement.click()
    document.body.removeChild(downloadElement)
}