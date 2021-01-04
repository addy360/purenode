// const fs = require('fs')
const { readFileSync, openSync, ftruncateSync, writeFileSync, closeSync, unlinkSync } = require('fs')
const { join, dirname } = require('path')
const BASE_DIR = dirname(__dirname)

exports.BASE_DIR = BASE_DIR

const DATA_DIR = join(BASE_DIR, '.db')

exports.create = (dir, file, data, cb) => {
    const filename = join(DATA_DIR, dir, file)

    try {
        const fd = openSync(`${filename}.json`, 'wx')
        writeFileSync(fd, data)
        cb(false, 'File written successfully')
    } catch (error) {
        cb(error.message)
    }
}


exports.read = (dir, file, cb) => {
    const filename = join(DATA_DIR, dir, file)
    try {
        const fileBuff = readFileSync(`${filename}.json`)
        cb(false, fileBuff.toString())
    } catch (err) {
        cb(err.message)
    }

}

exports.update = (dir, file, data, cb) => {
    const filename = join(DATA_DIR, dir, file)
    try {
        const fd = openSync(`${filename}.json`, 'a+')
        ftruncateSync(fd)
        writeFileSync(fd, JSON.stringify(data))
        closeSync(fd)
        cb(false,'File updated successfully')
    } catch (err) {
        cb(err.message)
    }

}

exports.delete_ = (dir, file, cb) => {
    const filename = join(DATA_DIR, dir, file)
    try {
        unlinkSync(`${filename}.json`)
        cb(false,'File deleted successfully')
    } catch (err) {
        cb(err.message)
    }  

}
