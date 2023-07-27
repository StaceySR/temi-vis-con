

// 创建一个user变量，用来记录用户的操作日志，默认生成一个唯一的id
// 用来记录用户的操作日志




class Session{
    constructor() {
        this.id = uuidv4()
    }

    async recording(type, content) {
        const res = await fetch('http://localhost:3001/APIs/recording', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sessionID:this.id,
                type,
                content
            })
        })

        const result = await res.text().then((data) => {
            console.log('data', data);
  
            return data;
        });
        
        console.log('logRecoding:', result);
    }
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      // eslint-disable-next-line no-mixed-operators
      var r = Math.random() * 16 | 0
      // eslint-disable-next-line no-mixed-operators
      var v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
}

export let session = new Session();
session.recording('start', 'start a new session');

