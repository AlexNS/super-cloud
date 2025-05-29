import { filesize } from 'filesize';

export default function fsize(size) {
    return filesize(size, {round: 0});
}