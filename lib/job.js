const fs = require('fs-extra')
const toMs = require('ms')

const setUserJob = (userId, _dir) => {
    const obj = { id: userId, job: "Pengangguran", lvljob: 1, xpjob: 0, multi: 1}
    _dir.push(obj)
    fs.writeFileSync('./lib/database/user/job.json', JSON.stringify(_dir))
}
//ADD FUNCTION
const addUserJob = (userId, job, _dir) => {
    let position = false
    Object.keys(_dir).forEach((i) => {
        if (_dir[i].id === userId) {
            position = i
        }
    })
    if (position !== false) {
        _dir[position].job = job
        fs.writeFileSync('./lib/database/user/job.json', JSON.stringify(_dir))
    }
}

const addJobXp = (userId, amount, _dir) => {
    let position = false
        Object.keys(_dir).forEach((i) => {
        if (_dir[i].id === userId) {
            position = i
        }
    })
    if (position !== false) {
        _dir[position].xpjob += amount
        fs.writeFileSync('./lib/database/user/job.json', JSON.stringify(_dir))
    }
}

const addJobLvl = (userId, _dir) => {
    let position = false
        Object.keys(_dir).forEach((i) => {
        if (_dir[i].id === userId) {
            position = i
        }
    })
    if (position !== false) {
        _dir[position].lvljob += 1
        fs.writeFileSync('./lib/database/user/job.json', JSON.stringify(_dir))
    }
}

const addJobMulti = (userId, _dir) => {
    let position = false
        Object.keys(_dir).forEach((i) => {
        if (_dir[i].id === userId) {
            position = i
        }
    })
    if (position !== false) {
        _dir[position].multi += 1
        fs.writeFileSync('./lib/database/user/job.json', JSON.stringify(_dir))
    }
}

//WORK
const addWork = (userId, time, _dir) => {
    const obj = { id: userId, time: Date.now() + toMs(time)}
    _dir.push(obj)
    fs.writeFileSync('./lib/database/user/worklimit.json', JSON.stringify(_dir))
}

const WorkCheck = (_dir) => {
    setInterval(() => {
        let position = null
        Object.keys(_dir).forEach((i) => {
            if (Date.now() >= _dir[i].time) {
                position = i
            }
        })
        if (position !== null) {
            //console.log(`Work Reset: ${_dir[position].id}`)
            _dir.splice(position, 1)
            fs.writeFileSync('./lib/database/user/worklimit.json', JSON.stringify(_dir))
        }
    }, 1000)
}

const getWorkId = (userId, _dir) => {
    let position = null
    Object.keys(_dir).forEach((i) => {
        if (_dir[i].id === userId) {
            position = i
        }
    })
    if (position !== null) {
        return _dir[position].id
    }
}
//GET FUNCTION
const getUserJobId = (userId, _dir) => {
    let position = null
    Object.keys(_dir).forEach((i) => {
        if (_dir[i].id === userId) {
            position = i
        }
    })
    if (position !== null) {
        return _dir[position].id
    }
}

const getUserPosition = (userId, _dir) => {
    let position = null
    Object.keys(_dir).forEach((i) => {
        if (_dir[i].id === userId) {
            position = i
        }
    })
    if (position !== null) {
        return position
    }
}

const getUserJob = (userId, _dir) => {
    let position = null
    Object.keys(_dir).forEach((i) => {
        if (_dir[i].id === userId) {
            position = i
        }
    })
    if (position !== null) {
        return _dir[position].job
    }
}

const getLvlJob = (userId, _dir) => {
    let position = null
    Object.keys(_dir).forEach((i) => {
        if (_dir[i].id === userId) {
            position = i
        }
    })
    if (position !== null) {
        return _dir[position].lvljob
    }
}

const getXpJob = (userId, _dir) => {
    let position = null
    Object.keys(_dir).forEach((i) => {
        if (_dir[i].id === userId) {
            position = i
        }
    })
    if (position !== null) {
        return _dir[position].xpjob
    }
}

const getMulti = (userId, _dir) => {
    let position = null
    Object.keys(_dir).forEach((i) => {
        if (_dir[i].id === userId) {
            position = i
        }
    })
    if (position !== null) {
        return _dir[position].multi
    }
}

module.exports = {
    setUserJob,
    addUserJob,
    addJobXp,
    addJobLvl,
    addJobMulti,
    getUserJobId,
    getUserPosition,
    getUserJob,
    getXpJob,
    getLvlJob,
    getMulti,
    addWork,
    WorkCheck,
    getWorkId
}