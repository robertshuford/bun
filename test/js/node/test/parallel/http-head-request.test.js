//#FILE: test-http-head-request.js
//#SHA1: ab54d1748aa92e4fa61cf4994e83ddf5e00bf874
//-----------------
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

"use strict";
const http = require("http");

const body = "hello world\n";

async function runTest(headers) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      console.error("req: %s headers: %j", req.method, headers);
      res.writeHead(200, headers);
      res.end();
      server.close();
    });

    server.listen(0, () => {
      const request = http.request(
        {
          port: server.address().port,
          method: "HEAD",
          path: "/",
        },
        response => {
          console.error("response start");
          response.on("end", () => {
            console.error("response end");
            resolve();
          });
          response.resume();
        },
      );
      request.end();
    });
  });
}

test("HEAD request with Transfer-Encoding: chunked", async () => {
  await expect(
    runTest({
      "Transfer-Encoding": "chunked",
    }),
  ).resolves.toBeUndefined();
});

test("HEAD request with Content-Length", async () => {
  await expect(
    runTest({
      "Content-Length": body.length,
    }),
  ).resolves.toBeUndefined();
});

//<#END_FILE: test-http-head-request.js
