### example deploy
```
git clone https://github.com/jobscale/jsxjp.git
cd jsxjp
main() {
  docker build . -t local/jsxjp:0.0.1
  docker run --rm --name jsxjp -d -p 80:80 local/jsxjp:0.0.1
  http_proxy= curl -sv 127.0.0.1
} && main
```
