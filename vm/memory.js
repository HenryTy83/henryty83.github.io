/**
    HENTAI: A 16-bit virtual machine running in JS
    Made by Henry Ty on Aug, 2022
    Following along from Low Level Javascript: https://www.youtube.com/playlist?list=PLP29wDx6QmW5DdwpdwHCRJsEubS5NrQ9b
**/

const createMemory = sizeInBytes => { return new DataView(new ArrayBuffer(sizeInBytes)) };
