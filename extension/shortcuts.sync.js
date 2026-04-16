// Repo-tracked Start Here shortcut snapshot.
// Replace this file by exporting a fresh snapshot from the extension UI, then commit it.

const SCOPUS_LOGO_DATA_URL =
  'data:image/x-icon;base64,AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAgBAAABMLAAATCwAAAAAAAAAAAAAccen/HHHp/xx' +
  'x6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen' +
  '/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xx' +
  'x6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen' +
  '/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xx' +
  'x6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen' +
  '/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xx' +
  'x6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen' +
  '/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xx' +
  'x6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen' +
  '/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xx' +
  'x6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen' +
  '/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xx' +
  'x6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/yx76/+xzvf' +
  '/+fv+////////////8Pb+/4649P8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/I3Xq/6LF9v/w9v7/////////////////3On8/6LF9v8ccen/HHHp/xx' +
  'x6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/Z6Dw///////J3fr/jrj0/4649P/w9v7///////D2/v8ccen/HHHp/xxx6f8ccen/HHHp/3qs8v/////' +
  '//////8nd+v+OuPT/jrj0/4649P/c6fz//////0CH7P8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8jder/HHHp/xxx6f8ccen/HHHp/xx' +
  'x6f/J3fr//////2eg8P8ccen/HHHp/xxx6f+OuPT///////D2/v8se+v/HHHp/xxx6f8ccen/HHHp/xxx6f8jder/I3Xq/xxx6f8ccen/HHHp/xxx6f8ccen' +
  '/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/0CH7P//////yd36/xxx6f8ccen/QIfs////////////HHHp/xxx6f8ccen/HHHp/xx' +
  'x6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/Z6Dw///////J3fr' +
  '/HHHp/xxx6f/J3fr//////2eg8P8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xx' +
  'x6f8ccen/HHHp/xxx6f8ccen/HHHp/1OU7v///////////0CH7P8ccen/HHHp////////////HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen' +
  '/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/yN16v/c6fz///////////9noPD/HHHp/xxx6f9Ah+z//////9z' +
  'p/P8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f96rPL' +
  '////////////c6fz/I3Xq/xxx6f8ccen/HHHp/0CH7P//////3On8/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xx' +
  'x6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/sc73////////////U5Tu/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp///////w9v7/HHHp/xxx6f8ccen' +
  '/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/yx76///////+fv+/xxx6f8ccen/HHHp/xx' +
  'x6f8ccen/HHHp/xxx6f8ccen/8Pb+//////8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen' +
  '/HHHp/xxx6f8ccen/jrj0//////+OuPT/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f9noPD//////4649P8ccen/HHHp/xxx6f8ccen/HHHp/xx' +
  'x6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f9noPD//////7HO9/8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen' +
  '/HHHp/xxx6f/w9v7//////1OU7v8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xx' +
  'x6f///////////2eg8P8ccen/HHHp/yN16v96rPL/Z6Dw/xxx6f8ccen/HHHp/xxx6f/w9v7//////4649P8jder/HHHp/xxx6f8ccen/QIfs/7HO9/9Ah+z' +
  '/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/yx76/////////////////////////////////96rPL/HHHp/xxx6f8ccen/HHHp/xx' +
  'x6f+OuPT//////////////////////////////////////yx76/8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f9TlO7' +
  '/jrj0/4649P9noPD/I3Xq/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/QIfs/4649P+OuPT/jrj0/0CH7P8ccen/HHHp/xxx6f8ccen/HHHp/xx' +
  'x6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen' +
  '/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xx' +
  'x6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen' +
  '/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xx' +
  'x6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen' +
  '/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xx' +
  'x6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen' +
  '/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xx' +
  'x6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen' +
  '/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xx' +
  'x6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen' +
  '/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/HHHp/xxx6f8ccen/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=';

const NOTEBOOKLM_LOGO_DATA_URL =
  'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMj' +
  'AwMC9zdmciIHdpZHRoPSIxOTIiIGhlaWdodD0iMTkyIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAxOTIgMTkyIj4KICA8IS0tIEdlbmVyYXRvcjogQW' +
  'RvYmUgSWxsdXN0cmF0b3IgMjguNy4xLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogMS4yLjAgQnVpbGQgMTQyKSAgLS0+CiAgPGc+CiAgIC' +
  'A8ZyBpZD0iU3RhbmRhcmRfcHJvZHVjdF9pY29uIj4KICAgICAgPGcgaWQ9ImFydF9sYXllciI+CiAgICAgICAgPHBhdGggZD0iTTk2LDMyYy00OC42LDAtOD' +
  'gsMzkuMDMtODgsODcuMTl2NDAuODFoMTYuMjJ2LTMuMjJjMC0xOS41MywxNS45OC0zNS4zNiwzNS42OS0zNS4zNnMzNS42OSwxNS44MywzNS42OSwzNS4zNn' +
  'YzLjIyaDE2LjIydi0zLjIyYzAtMjguNC0yMy4yNC01MS40My01MS45MS01MS40My0xMS4xNiwwLTIxLjUsMy40OS0yOS45Nyw5LjQzLDguODYtMTcuNDUsMj' +
  'cuMS0yOS40Miw0OC4xNy0yOS40MiwyOS43NiwwLDUzLjg5LDIzLjksNTMuODksNTMuMzl2MjEuMjVoMTYuMjJ2LTIxLjI1YzAtMzguMzYtMzEuMzktNjkuND' +
  'YtNzAuMTEtNjkuNDYtMTcuNDEsMC0zMy4zNCw2LjI5LTQ1LjYsMTYuNywxMi4wNC0yMi41NSwzNS45NS0zNy45MSw2My40OS0zNy45MSwzOS42NCwwLDcxLj' +
  'c4LDMxLjg0LDcxLjc4LDcxLjEydjQwLjgxaDE2LjIydi00MC44MWMwLTQ4LjE1LTM5LjQtODcuMTktODgtODcuMTlaIi8+CiAgICAgIDwvZz4KICAgIDwvZz' +
  '4KICA8L2c+Cjwvc3ZnPg==';

const BLACKBOARD_LOGO_DATA_URL =
  'data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAABILAAASCwAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAP2l6ADlaaTNGfJG8R2Vy5khreOVGeo61O1JdK0BcaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9LioANCYjDCIOCw87WGVwVHV+/EhgaLxLY2n' +
  'AVXR8+j5TXWQlDwoNNSYiCj4sJAAAAAAAAAAAAAAAAABVPS4ATTcqJlhGOatIVVrJQ15o6lRaVtpKMSU3TTEcQVRfXeBIbHvnRU5RxllDNqJJNSwdUDoxAAA' +
  'AAAAvNTsAICYtC0RISplMVFf/RVVdxzxNVmw3VGFjRHOFlkJwgpI3Ul5gQFxocUNXYNBMU1b/QklNhxweIwcvMDQAHCozBT5PWItOVlf9V0o/1DExNTlDcoS' +
  'HTJGq60+euv9Pnbn/S46n50Fuf3s1MTE+V0xC30lQU/lAVF56DgkMAiA9TxJNWVrKZ0s1+FQ7KHBEd4uiTpiz/k6gv/9OoL7/TqC+/06gv/9Nl7H7Q3OFk1o' +
  '8KXtlTDj9TVtfvyQzPg0SIjEISzsyWlk4JV0/aHmETZCo/FZ5hP9vb1//cm9d/3JvXf9ub2H/U3yJ/02Pp/k+YW94XDskYUc5MVUPHy4GAAAAADlPWAA4TFY' +
  'hSoSZ21CGmv9Qj6X/gVww/6BRAP+gUAD/e186/0+Rqf9PhJf/SoGWzjE+RRczQ0sAAAAAAAAAAABIdYcAQWZ1UE6RqfpvZUz/YHp6/2lvZv+bWRb/mVkY/2R' +
  'ybv9jd3L/bWhY/02QqfQ/X20/QmZ0AAAAAAAAAAAASYukAD9xhF9Olq/+fF41/3NKJv+gm5b/ysG6/8vCvP+el5H/ekkb/3tlR/9Ola/7RGl4Uk16jAAAAAA' +
  'AAAAAAEiOqAA+c4hfTpaw/nleNv9ySir/x8C9//Lz8//39/f/w7qz/31MIP96Zkf/TpWv+0RpeFRNe4wAAAAAAAAAAABIjqcAPnOHX02WsP59XzT/eFIu/5m' +
  'YlP/GtKP/x7an/5WTj/+AUiX/e2ZG/06Vr/tEaXhUTXuMAAAAAAAAAAAASI6nAD5zh19Ola/+ZWpe/1aIlf9ra1r/nFID/5pSBf9mcGX/WIWQ/2NsZv9PlK3' +
  '7RGl4VE17jAAAAAAAAAAAAEiOpwA+c4dfTZiy/k2NpP9Rf43/gVQg/5VQBP+VUAT/fVYo/0+DlP9Ni6L/T5Wu+0Rpd1RNe4wAAAAAAAAAAABIjqgAPnKGX06' +
  'cuP5Om7f/TIWY/1SBiv9Ugov/VIKK/1SBiv9Mhpv/T525/0+Zs/tEaHdUTXuMAAAAAAAAAAAARXiMADticlNJg5ngS4ee4UuJoOBKiaHgSomh4EqJoeBKiaH' +
  'gS4mg4EuInuFKgJXdP1plSkdpdgAAAAAA+B8AAOAHAADAAwAAgAEAAAAAAAAAAAAAAAAAAMADAADAAwAAwAMAAMADAADAAwAAwAMAAMADAADAAwAAwAMAAA=' +
  '=';

const GEMINI_LOGO_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAYAAABS3GwHAAA9RElEQVR4AezYA8w8VxfH8e/v3Ltb27YVvbaD11btRm1YW2GtOL' +
  'Xi1DbiRrVtPtqde/64mUyK8NnZ6nySk3NnNpz9ncElhBBCCCGEEEIIIYQQQgjfWCJM3dyvf7210ZwK+jWAy25351jgWcJUaemfQZiiUrYx+YOI9ZDh7iBD0l' +
  'sl5R8CzzA1ITMYMD3BFmZPBa0nRHFAwhFFWo+mORX4D2FqsjcNYTpWXGGFlUcL+guCAoDjGBK4g5v9ZaXBYGVghjAVeemfQpiOZu7jnwNDEKDaEC4BAtdwZj' +
  'T6OXAjYSry0gtOmI5B0W+Rg4SAgpCguHCBy3Hl38YATE92ZcK0zP/GEbhAIESRcBxIIIH8N4SpycgJ/Uszn2xJ1k60gZfhAC5kogCO4WincUlbAs8TepdHZU' +
  'Do3zDrL47AAdWOCYDiwk0gcAlL/Bk4m9C7bIkwBWWkP0vCBdB2qx1wDFA9Z/pLDMB0ZDfRr7DG+O31Fmz4QxyQasMoOE4ChCSKhAsc/TCP03rAW/Qq5DTO9C' +
  'uMFoZ/RSQkcEH3zg8Cl3CEY22l0dD+ClxCr0IeDY1+hcGI//OFrz7CXTjCTXUQzHAZRfp//wMQciPRn7DqzLtbSfzQES5wicpAqqEHnBp8pxayHzY5bQU8R4' +
  '9iAAYD+hOslP+5SWBI4AhHIFG64FMknHquIBxTaex/wKn0JuTSGP0JLvbGP//qU0MuXKJIIOEy3BIoUZRw2d79DkDILqMfYZ2PXvwNsm0c4ejT250CZPVYRs' +
  'EoEoV2EAxX2qYh/Qa4jV6EPLYhPQmuQxCAQMJRt91JasPedsBAhksUWftEOKS/AQjZUyJM3nrvPbORS39wiUq4VDs19JjhAEq0gS9KFAzHaDCK7A9zKW8EvE' +
  'aYuDyTh4TJs6Y5jGT5U1ueqkUtCm3oVbslilkdgvZYKeeSDwWOJ0xcziUTJmu7j55Yec7sUHeBgWMg4V3wl1ddi24QDMdow9+uG+mwT1Ze5UxghjBR+cNVVy' +
  'VM1vzbs/s7aW0kHIPuvR9HuNpzhteifKrXXaBmedmyvnZeGO8PnEeYqJwXxoTJ2eOTJ9Is6QjUbXMiAal2MwqAEi7hy3uivu4YTR0CCkax3A7Dsn74Ux/vci' +
  'HQECYmP/nJ7oTJ2f6DR/+OtKUjMOGAYxRRA4+BjDbs3nW6Ycg0yzpGY7kOhGyrLdd45u/ANYSJyUsvKmGCPtLRjuEStRuYgPbVRrisduoguNVeavjr2hIN7a' +
  'DkWpaPmuwAhNxYJkzGHi/c/k9ku9XwC2r4KSRcqkV3t3dLdY3RvvOXT1WmaX+z5evdl/Z/AtcSJiIv2JDFCz/d8D2beclOdIQjasip4QZoP3Kx2uv608G39q' +
  'O3eyI0aUBDqk+PlBgrn3jf+m9dDxQWLeS7NnyPxQvffeSR/zvsCMLNcARK3TB0uz5t2GtRnwRNLYoybrkeK3cDYrW70o7ff3fT/wGXsWghL72YLE743WOX55' +
  'mVVjoeJYrowi99epvTEq7UnUM19O1Q1N9oJEoX+m5LlMxYibHy8austcVVwJiwKHmFtbchLM7siise5kpL2HsL6MuO49r7V3XOnbEctGMIx5HDzIk5Sr6Y/c' +
  'VMssOJAn6mx8/sMJlCll/AGL+Yw8wOM7MhzDHLmnu69oOuWrXuGo9mRpFkzcy/tM7qc7rPvTNrVNW9967qvhfLQIf1PHktyFPVwQ4Jb8qd/e468b5NZx+F/7' +
  'slbLnlv77uH77k358XOLL1//xDcvXtyD7j9/7nu43jN3gCGIGl89dlqGZ1DPUqQBxeCXlaAt2SBMeSweA7Rr63zXefQOgFwL9yte3I1mHO1bcjW47f4Mlhfi' +
  'MZQDm99Syf99QqYF7YP8d9On47f2P+erYMiuIFkxvceOx2TwL+A0d2tW3d7y7iyK6e/f9/8MyPCLMvlBlV2yP3dO7U+tvx59UwZio+TXjnNcnxfM99wqAcL3' +
  'i0mbPZymC57ErzZwJ/wJFdLVvfbDuO7OqaPU3mq8wRh4RXlsVsnrg/nT9n/yS/PdOHrTVe+L+DoiFS9hccWldsfRrwGRzZ1bKVq5UHOLIH//5THxpmnxZmYF' +
  '7wp+p2GGYleRa5bbyf9+XUg2ytnXzzlUE+58qwkcGRWeLNnOH+6ZvvHgI8nyM7a1uvXI9zZGdnn/3bX3MTYU+RWVd2YmjpcmYO9X4iZ/LG/Z5OvRJe1xzPFW' +
  'HO9EmChxa2JSESHSADZ8ifsq27HwH+mSM7ywBYzjYAjszg6WH2bspEV0KdLmaj1B4vp66rS5yXlfDddObE/BPv7wjfMUoN6lUgodHaKweez36TgT0NeAhHdp' +
  'YqEMaZ25F98W888S5hy4Mm9OkiN8yIw3KHgjrt/NWm828sbDXbN/afJJeERl4QaO3Ps+bYbvaxMOQPHnbs+cCPcBZ2VAvEDTgzO7KH/fZj3lXml2MGviCM0b' +
  'p/4X/kzkbq/4X5fUGt8jCq3t9L2ZlX5HNY9w8vXlBKUY6xtEy6OENcfsXxG3wU8HrOyI5sfdMNjgLgTM2lZ8r9vbOMIRWdru8vuXOwIl9ofT8DwfOinLicej' +
  'lw7LCDzO9BEAxL8ovn/TLlUjnhy/v4Pi4HHsgZ2ZGtvg9Ob0f23379P32W3O8vyvl7G2OrPpZQp8ZLyvSEOA1zomb36nPPRNe8tiXhUD2zEpU3qJUCZ9B5h2' +
  'AlsPuHrz8EPJdrwo7OBTqyx/zyw95f6/pNje+b5CpVHdHFa53t9RkIvivIwyiimzP85ktBn/leBkjLnfnsC3tbGUyOELIKHCI5Q8BcHWTP2HTs54/OFT29rV' +
  'fEcY7s1PZNP/nA9fU3vtELZP5Oh7X8hsrJG+6U3p9OudKJrLzP8b1XwLTis29YM52eJL79uflMvoMTdNANZr5B+Duz6AU3ufLdb3/VFaNHtt5k3JwjO7W97i' +
  'bv+hRknyJ3gia76urNnt17FehqTxKuFOzpYGD4Lp8XNttlX6o7ZH/DoLx3oiDR4mwYoy4WBAw3hviUvzv2D08BHs6RndLW//OPxNu2I/vq3/jih8j8YUxy27' +
  'X8JOafBPQgyVVkN2a5Qis7+U4T3Zr50/l9qfuGQE2AGWT+oKRTnI2UWnHEitwZqkA1ZP4w2fIrwAt4m3ZkayzHOLKT7Wt/9XM+ypbdM3PWbzzftT7t9Nk3n7' +
  'Oep59Lqck2JU9fpwNP5+8+83Z+MmiY/ft8jgmVOqssZxgENgk4dU1pNBZ+D/hdTjaOMsHOkR0az/ith94oluMvG9gNWVplUSotSuc+ecdW9bV8GZ3ImpBHDW' +
  'myHuhQ5kxI1TN/B4VYiGWZqwA2s8iWcqzmqjRkBDCKrMtuGIOXrcf1CcDrOLIDW3012o7su/7ov+7+bRx7mdwvTrx/IHcKq5k92wPMf6DilNQZBWvSqSuJVZ' +
  'tc9p5OnVndveeqwLzCVvbp/BvOZgZaGcUH5MgtoVBup5QhMaEadvEVe3v5u7zLO94R2FN2ZKzHbviutB3Zv73hn75Ty3qHoJzesm1HV8OehiFWjl2Ed8coOJ' +
  'Pjtakla35a35+fSedfe+YvIuw+OUCqP8IZGQxDThH0AfPvJXKVAlGBwR3+9fVXfCfwUMqOjPX//KNwZNMu/51Ln6RluTQwemOLHZzTc3ha29qrAVW7k7Oy+X' +
  'TyhkOt/pA8oInunOXNc9zZ559Zzr9VwMnnSqDcUI/Ny4yhfKd/gjXvQTJkdmnAq4An0HZUDHdk8J2//aDPiWV9XOB0YqvJb/VnFWZJnAfbFA8yven8e1uJcv' +
  'KCPsUZama3pUmxOxtr9iXEIlcd5QYb5aqTjh3ubIn9lcEQkcV5JDkWYIYUjxtmrwaezZGxbnCE+3//0nuNZXlWHBxjktDBGmtHtvI5i4d3sqrreQrS9Cw/6r' +
  '2+n2MVEBk8CZlS6rReVUr5cc/vdjarkgxjhKGSZXEUSqhmhCCwdH4IHMmeZZMQv+JoR5icC9me/UcPvLPMXhjua+nnwYKWZbbl/DSxLaesqzO8Xb8TvmZmd2' +
  'n5kybISXAzENLBk+wOMuubhFdyNp9Or9nXkqcWwr0rUwNG5StEQSSEEQLM6jCE/wXc8wIunz46FeIFf3T/OwzspeF+TFXNycnHFqpXgW7T2eU7NjUJ7kDIdy' +
  'JLl736UtEp7b9mdBaiZvx1wp3NkoeszlByjtL3MVQcRTB8QQFhdjjzuxEyBAgDwXAHOCbspYbuCvwsF6it4sK05/3RfT95mH9fuF8kO3D62R6e2EYUVmc6tL' +
  'Jvo4rcdrVr67CgbS0inPp+fu5EbWxnabUnnLGsB6Q338kgMWSeWv98JpNiEgXb0uFnIIxyfgGAEgoJA+OiLez7fIk7Ar9yga4A4kKz7/nj+95+uH9/uL9TZU' +
  'z7iPImnkGSzcURXZAWCWFks6qziW5CIkr5mW3P+AubutYn9wV0cduSKhI+tX3L4EjyK3mvAOaQBXAiIRGGDAJDeYUBogIC8l2YfaB3GuE/Li13B37uwiPBY8' +
  'eFZC/+i7vfaVvWlwm/6KC8gd6wfhgIpevnbG+zHb7mfRPesLzHacxfpLYzvMN8EuHF+3QHqr+yzMbAW31iIYxq++8ZJYEaciu5k8hgIEgeAwAhm62BQgBI9o' +
  '4QP2yK+1xonGA1bRfOzP/ae90rfHmhzI8NHLn1JnYz2tH6GpW0oslusOZ9Ofguoc18zqvfqRWhMH4R6SLC7ejZZ80HrPMRm1LT98z+CqKcvbC+FZEHBYAxmC' +
  'YcAUJIjhBgOcZFsuUVJnsQ8PILiAOsXAj2otfe7XPC/VnC1ySH6XTWzl5OiKNlZeDpxLXlsEsTamYfnitCwR3bJV9o1WfD5gpQn8GzFGLeBztGafnkFsosdW' +
  'i1Z7bCEvbQSbAcV7VSwR1kDhJh1jyAIsVtwiYxNn3PkH3RhZInWPec//ayv77rk7T442RLzpQlb7bD932VPFji+f6hirCq00/oM6/O2tputuzYDsht6/yDhb' +
  '0tDFXgFN8wtslFJk+A6exFekv3twUJBqn7C8Qcm22kMzfsEQZqpwdDKN9ry/EV03ciXXwh/DbxCsH5aj/36k/a/fMNbvqdcr9UndwiHOQ500/c345O3i8JXe' +
  'jE18A7wVXveh5alcGxecmVWbjGjrGueb80zFkyaKqUGScS8rS8WasUDPI+mLwl4VBgvRooAM/naVK2QAjooECUWb9DmtljJV38uiv984AT528t0HlaD/3K11' +
  '3yrv980Y1fLuMOgaGFlA9BS2ZMcaJn5j6bn665HzkeWtgXJyiI0zP83MSu5eQsLvU9GUCqjS9GKAOQXHmW+edsBiPx/AbJAcr5FyJJbNCEN1A5dUud1jhfYp' +
  'psjqMKBNLyc6IMswe/y3G9t2P3Av6N89DWGx3nvLPv+/v/76O29djLJLs46CNLomZamJc7A076fa5NferChhOl7JCrQpU9KxNbS2d8w6q/+vKZw91cIU/Z1N' +
  'AB8a3gSUKrXAFCyNb+u1cJtErqNBDIU/5kmjiwOXbg5FTQUKbDD95+SL+2uN0H+J3zDwIZ55W9/J8uuXQ7tlwu44aycgZr3VwOXjO5IVp7Hw1t5jWdPeFLBo' +
  'lSuiweQGr7/ZwrRcmkncHdN9Fmr4Uop7fU/gHV6uOa4zb7ZGQAU6pV4n+BSvNvbA8CkffzWThlau9HNtuQaAORZnbxEL8Q4kuA551fJDg4L+yXT1yy/ssVeo' +
  'oWfxhL49lhBQtg0CpLtGMSZunw1P5b9lV8pqUL1LqOpw+m8oY+MzBSJlXmDtS6f+L8TrCRVypMIlckqpLT531p+dCZXmNeAZK1zk/BmGzNup+TLXKcq1gx0m' +
  '5oxnMkPvmiEzwS2DgPbL3oxHkw67/1Vrf4F3bfHe6fIiC8JUH5dKaNyqCC8Hnvxsba9ftkuXEYUUpN8oUDxy+nzxl+Pntr//IucbCCUTZbKtisiDcR9WxzPB' +
  'Nao3C8waYOApEYH3rmB6IVnlOoP90W5udUY02OD8eML73iOB+vjQefD+cOrW9ZOKfth6649WeNdX3GMN4ZmFBHEJ6zZToVvuS9o5Y4J/Qolac2vCx9KFXi/N' +
  'buOzCQ2sn3tnY2l6713ytrhSIzvIX3ydVHzuaGaiUwWv1JcjuSLAuh6ocmtEXuAZQtHSBFhLsXwpy2HjnDvk9m5bcRDweewzlsKwvnpP3I6z/hXXR8vZyd33' +
  '8gYGr8ChGrI2pW1Jx9iwBP4tgrgqfmHwl5ErbkitBn86fzb5R8mS1e77KFHZzgXI6+CQZzTBhROYBKYlFaP0TkiQ85Jhx5O3nV+WAc1PQcumv3C1D7P5xEeL' +
  'OVDvuw0wXCO8n4LuBu+yv5onN1w/164hyEQD/Jx99Z77BcbvA+mwQOgZAM7XI2dGPI0hkhkjSGl8NaXszVYPEqPJv3tmNoYW9GKBWdbPfy/qGKlEdLxhxAyN' +
  'gbU/JcjKG5WoQmvBlWMGvKol3K4AxPpw8yOACMIHrTu1SS5XwXAKHG/YSMQ68neUP3n9rB7WxWhfvujvMpMi4DfphzzNb1Bpwz9lNv/YSbbKuehvmDA3qJdw' +
  'hBUBjakbJ1Sl4sLM5QBoEVcSUhCgVpGDLGkvX8627O+Kzs1YdfVV9U4NhCzPGUL2e/8t2BVz/hxhZOJITZlLjejRjqkyiUgSCK2KbUSQYESIFZ3gPCDmf2w+' +
  'rPUzv31e0X7434QYMXxjEecS79Us2q9Rxx/u1jHjKO81Twd5MVFgYVtBGoVoLFGGEMyFmW6dSeiSgoctqlDcbU9zM4qvBs8yKwSweNliS9VjziIEE2VKQZRK' +
  '4YGEEmt2StPkFCnaVWD8Kb7AYlT3onvtQzOSZMjfOFgU6l9oh87dTOfVro0yZxYIIH2QnuhHj0uXI69WpXcr22nz7+ER8Wsqdr8U+PTvMTB0EQRCaJSs7UCo' +
  'GxmUrxmbM6ZHWmTQcXufOqpM90dnlJn1WLM/uL4KpIriG8lR0x/6yg8gaosrnt+PmZ2apKHHIsslJzSBgOkP3l9IXlQen8AsCy5aCVGW0G6iZXibOZ7U9pOX' +
  'RjjGcDn+3Ow6/vP+G62sL10n7i2EfcGMWTw+yLAlsDgYnACs8SJkJJGBdlbTwI0tFI/A7DjM0yCDzYlPtuGx7Nd2KqMiODYE9i9pIw6Zl+KjxztdkK2iQMig' +
  'oSyqmZQVd9dSEUMAC5E8o+DPCWQhvvN55XlzkjgdGGHUqdp/Jwg+6yU3q2AM4OGl0SwW8h/uexPY8D/vX6yQHeyvXKfpFL1jfd6G++JGx5IsaNSvNGUEEQJh' +
  'RClvg/ck+sd9nwmLh+kt7oFWCzUmbS4bFJcJPQbut0uk0w3JMP5Hus7BExv6/VnIQsQ0m8HSJswqcBYU4FwdbbFmfwDCMMCuJ00Vrem4NBHOj57fz1GapNSz' +
  '5x+hlbIJ3esa/OOLDK+JK3HuOBDk96pxN86/UtgbYev75AHczffPMPuPRNocfLlltSqo4JKZ2dqpCcOFkmwpI4WhAFQ6zKH0g4ZHSiydmMnPUrKJitWyo/if' +
  'dlWQiX2r1IWATCkkAn8dUy/7wwVFWhAi0544dREA5Fqj85u2OduQZI3mJmSFASqBlIDXeioUx7PfkZs7Nz1jRdC+8Y3EjwtDcc4+EST/6tPc8HguuBGU8Ub2' +
  '+78j3f7/57dk+U7EOUuLg3d0CXBeRMyjLvs15HeBPQ6M0os+bmeM7KO/Ycm2rMcpwTY0F+nL2W+W4cZ+/HGOwY2s2TmLWbB9qOXSpCx9hiYdgxQln7P+aJD0' +
  'piHCwo8miTUoZiqb/z7AtaJSIDQ9bnebJA8gnwru+REXTtjwTQKwOI3vNrZ+ysoVMw42spgIA/wXgi8D28nW39uLfTEvAbV5qfuMX73hfZYwJ9pEKglupkzF' +
  'Y50ysvd/r0s0p0wZZkbqzzPlAmspRO7bT6I7Q4G8xE1rKwBZMjhE0iHFXI5uyXCjYYyzKJdKT6tBS57qMLZc4gmvhaBrJgIJS5CaF0foiDjesQsnwDJCuymi' +
  'sGLWm2tTKks3LS69Lxyz4Y8ULgf2B81S1vyUuAwdvB7H4vEtelvYj3uejKK/gCMx4ldIsJc2BjBzlD9vI+Sel0DG+NvTR9MjMb3qeuaZ0whnXq9uQvrrPOnV' +
  'qax5ScYMfQ8ZnI8uOEjk2Nn10WsN1gqkWanwllufOYK4VYGLEyqvBNu/p7tN5Pzv6pGEmO1NJpBCj7B05BPGSN7dV1PyEHI58NRCe+LAesV4YaO51lruDaC5' +
  'DTf/41iKf6nu8A3sJ1aOur/pDrxH79ljd9jxPr7ktPyL/EVm4sQPT/QAWAkAXC+n/2Yg2FHEJBaKESSAKGw0ZCJdHn5AvkqffL2YC9rHV7WZJccqVwTkSd/E' +
  'Dyg+QSmvt0Y7W5Eg1jW8Q2QJY4f8lSDDPC0sFNDJK/VCvaiSFVHwjqGbB5I5T91qSV9PWTitrsZGnnKtCNOGy57h2/7BYYT49jPAH4NhffCvwd14Gt7K7lMu' +
  'UPvPlnwPLFV7K7h8lWoVYpaAwbZhigdGyr8mU6zR8h5FUnw8yYuubqEKnBLzAECojFOQGz32HIsw5IbIjhYh8wFmMT7PPzW6k5+XfYB63s4Cg/G2Hp7BBbkn' +
  'AHJEJQChJJXkPReJ8ZJGANcVAXr+mw1udkZyVJtF3tWVvXkdOfxffcGHhMGP8V+P4wLgd+7Fr+mdRrwek/6D3fz4mHAp8dslsKYfjhCWVAL88GkX1Kp7cifJ' +
  '3wCrfZJnGLtRzJEiapyo1T94+DoBhkW1ncgLH4dH5P/E86fsC+sstKFWkRMdQ5AYfiJmMxNAMiYY5ArfKEysHzuXlBQj6BA2pnL6Jbpnn1RAEgndKxdB1g+2' +
  'speFbgXi7uBbwK4zmC5wGv4Rq21bhm7Ldu+R433R/b7g12qbDbIqPNCAnzSl9WdzlELflGeM1qPQuWEyoqmQRYOTNsVjAoibGREmgnojaS9AbsgQGz5CFgeD' +
  'q4dUJsABGWxNcYG/MdZwZApAPTer8MCv4odX4NEdCSZ2r6DW1yDEC92olTJ7DCmxfYqT2tZNR88ZqTOq9juHQx4kkGT5L4BTeeL3gZ8E/XTACIq5+0+tD3uM' +
  'Vy7MS9CPvMPX5bzFxRuFTp7Jb3gBlYg9xonQM5KEAWkPq8WMCUMmZeEkGWN4jeJqhyxoRC6cgRieFRa/5mWa8jtvmZDIRgoA4Ob/g0D6gVQ5l4603pKMQwId' +
  'FcBVF8QMrjyknHt57p5aAhoAOqLACDwwSY24Hkqb49I9O14aTX0XeacRvBbYBvAV5p4nvDefm/Z2VYZWcxy3/Ee91wLFfcQfidcO6o4EOQI28yi4MMLHdjIa' +
  'alw5ggluozkAiS0KYzC2tnwYl8HgFyyz5SPSnt3NLxmLgeJtZfMukVsHmuFiPYPBis6fDBsJRIQ3mvXG3EgMTvdVhVJCGHMeb7yBiezl4OTQarG4wMhnBE5H' +
  '3/++gkyKOGg0DlRU4y68+oAVK2nFwOfQrPQtdPpz+FOXB7Gbc38Y2IPzbnxxT8qO/52bNRktblSk5rv3Dbd73Yh3/VJr8n+DFo0wqGYUyLMHrpFeZGCMwcBP' +
  'KW8DAhGfkqAfM5hynnT0eQlSNkYCgQK6EugdgwtCYUwhnB5AK+dv3NziehlbKi03J2T6cvvmDp9DBJr8iM88JWjm9k4KYCJIOEbGGgIuTWThruKATeSa3QId' +
  'FFYBJKibNHrN27Zc5DyGPQgdWWY9eKibejGR8i8SEYD49jnABesRr/A3gVp7HVT5MI+/lP/D/OH/aLmN9MB8WEhpyTdxEts9OMdAiwxQmgTyCwA9lP6fjTut' +
  'xBCJmlA1X21Hrmz/cGMCI3vZQy4zDg4CiUIYhSeyxn7DEIFmKZq0RYsIXYh+ZnkhAPB8U2a4gEuAFZkBdBEGCOgIhAZhB9YJVwyBVBEuSzNPumGaCGR9beXM' +
  'pYK0SAGXZW3ijATjN2diaud3YMuP8mPnU1bn26IHBOYx7LV8qXm4WBHHAwMzDqmk5pddgssIAMtDisTixgqeljEIvVd2VryOa96j3P7YsGWkHOdOps8dxd5e' +
  'nkC9OhJ3yZz4tNBwVqW+TmEC621Oe3hVSMNPuZ78WiDB4RNhCaSThLHG4jVwwIB+rPzedQBW3yGwtCQAudqW4JM+WqF50TsISQBoYOJxkzrOVPdIaeaNip3z' +
  'PjTE19XZ/tZpv4yk1wVde6iau2hUvS3xujNkShrDguWS2JHWJbVlD0zCmcEBh9mlkT4z7uO8Lmc0GBgjulpVP1/CI0HV+V8BLEsqT6EwhRn4nFcub2nOU1Vw' +
  'UTikASG0G45oo0JiQSC6GgVyhAE2YJR/Wfd56CIWQCAlh66yJAJu+wxIdmBHYADw3ATlOLfxI8Alk+6Awnezu1V4tz0i7hNLZyWmulARflqIahVnbqfrYLAI' +
  'WNW/hZDDGvyBfCOOQA4cisSeFiDHqPbKkvQzkeC6WyBElMRSowYlNulnFjA8aYfEAx8pRncvafQSDVamHILHV/zUCIBDG2ZDlzJKFdUEynlmJCtII9kc6dih' +
  'CIiHLWABwZELkKHpLYDDOjWpIX2CFhaI+u92y2dnofP6WJ89+c09hY7Kdxg9Up51ctzwlVRLeygivzPXMjLD9j1Q+4Ect8d3jp/8y+xaAwumWQLF5Qa/a5J4' +
  '4nN8ILAcO6f1hKpxQ0qWemXOqBBEIU5g5LSdMCKQjX7CdgGUjByP6Ahi0WCbWKDwizKKdO6XO+gwmZEF3qIM9+jZOztZ1CO9k5TZhZd9Z9Pou3fSHKDscsW8' +
  '4L++l/9wpgy/IYxbgEdDPcIGc1GYDNVunoIbAMCDrLiUHYHMNAssMTzCqoVG0GBaCSFs1gpDpTq0s678Bm3X1Xh6JhaBEahcmrNkiEhAK2xPjDGwIVoY1cQV' +
  'QSqC9EkeEQYqBMeGEbYgcWSAtYgIwo4mvC5MiFjSLIAjTvpXwXzOeYulQkL2hxFbBeme10M7b1YD+eHgqd4/aPq/EYTmO+GlzVdbtX/v2r8OXWwl4k8xMqKG' +
  'PzMgwwRq4CmFMrhNxRzei+TIdhjmOGloVYFlSE1xP3uxPukM+q8/oXQ8t09iAd2z2lReZYSqVaup3vCiySWIuxAia0UIm4dORU7x2iyKsJKVtyVcDAgmAgAQ' +
  'ySblMcQCjHa8a3hDtBLAURxbROC4YdemuvA4fOWW2Iw1ctn02nUYQ49bhxrtoJ4EWlAF0DHCCDAB74q5/xXjd8y1vjDmZ2JwV3NLcPUcvR6eBpBta4tiVPo6' +
  'VQMyI/D05vBSztvEhlfjbHQgLPYAJk3gmzFSLl15Dm+JJ9C0iiSglwEcUXRjB8ITz5iAbSQiCwdNgRM6gVyDYUO2RzJUBOWGTJM5gC3NEQmAgFWBLnZcFSKj' +
  'UgOktVIg94kmCB0Q4tNR8Aup/kBWe8Chg6LSk+R8iATk6EBWdma1zJGdsn/MDfvAX44bx45Z3e4xaD5V7gnwncVsJlBkY6XkOeVo8c5XgXsUFEBYRxeBqaJR' +
  'zyfPbeRhgxMT+Wejz0IVNdBkEA6dijcLoCsSAT4SOJbAWNEMkHCKQVKSCxvkUw3CFGk1gFRankQYRj5Hk9atijxWfb5SLtZU6OVRCpVTTa6TEwdd4hXzrZod' +
  'VBg50aCh0GwTkRCFGlEBIvA16rkQMrZ2X2sV8hrgn7udt/4E05vt1b6CEhuw2FUY3G++ngQDt/3u+1a4dX/R6udyVmbhrZqzaq1xk/87ObjI2VLYy97eZGF6' +
  '3sw+dGmHD2rGzasVf+bNH/u59bHedn87d+tTJGbnDRMcKW+cyOMVbEisYcEwuKHREr1KaXsSKK4a95UNYyx8MxnAgHOSLbSO4ky2gFlLyonjF6MwwtoUI7uW' +
  'gu3GNX6ciCNrtey0OvNHjBNVoMh3ON2O1f+Wf/BFwOXP5Tl7z/LXB/qOCzhV2MAQ6HpxpTJLKTQlb3zRWE9aG2VJlF5wgii9FUuQBzQhQSpzxBS34uaCWLIt' +
  'rRW9JjAQIlP8hs9nwOkAvF/D5Gge/ALAgtCMEiCAg3yqxqhJyWikfO+EYS56U3wlg7tMZhiU8tHFh2FARV+7CyD1mP6YAonHolOF0g2HUaEH8BPIfgecBrxT' +
  'VpuQJcm/YTd/7AOw7ZZebcI/AVIKySXVCqz6Zd9vVmkXnvXb0pRxj7Poh2ntCWq8E+r7n7a+WE5kG3+1jmDI+zxS6fd5yIlWBly+ct5tbJMeZKMbQSWolY2f' +
  '5fO2f8iN109rEyWEA7IhaIBWmHbJnPWpCyjQVwVH3KmV8OkfJuWH7GQN5ZABmRzwTZn60A7KRVgGoMTDXOYYRgp5/c7e1SHLQB3y/xTODHuRZtlXGt2qf/6J' +
  '/9GPBjP36nD3sPOV8q40tk3FgyMCWGrtWhgGrBgZOTbUOgqkBN3lA1QgBmdGFZAAhblNjakKtnSA+QkOcX51qDpZqjyMTX7DfbkJpUaAlsGLIkvFQWeQECzC' +
  'A39cuFhfKzlU/Jv5cDQ2CGKZA5EFBOb2DFG8ww+jhEM0NwMt5XO2K5+uFKYDl+GgVUVzMQ7GoFzL9e11si7eO/UlyX9v13+oQbyq/4/HAeJfwWqjp+9S8jRj' +
  'p0QZ/iAFuObUxucMIWIow9S5/kJs/7Za4UY52Y31b228rGMt/XnPn3ObsPdTtix1arg3bEWAktRK4OoXkRu7zfJRdYUwXagTzJc83+s5UWTEatGOaGhqHiDx' +
  'iMBWGponkXyEURbpsXOYQBPUkgO+WZnwZIZ0ZuxXUkkRqvAZ56g2N8O3AF16HZrZ4i3h72i+99/+WvPvRP7xuh/zHgIzetSIfnYw5mG14QKFvyKEKcfTh7c0' +
  'IVAEuS5TzpLbLfJhE+EesMkDGDYYtqjzFiYSvIQ5Hh2UZCohEr5OkRinXCIRyNHdiER0Q6f3hW8lVgNCyaY3mZz+ewllSjII+BeTt7kmUD1EFAmNOyv4FOc/' +
  'CtDrvOPhCukaD4PTO+8jffykuAuGAPxvrz+3zMAyLWJw78g6M2v0AqQLUK+Hw2n+d31t5fFf632eZqsWdhPxZGnc6sdXKEyMDQsflergQj1gyYXfKCPGSLHS' +
  'NWYuzyFyDL8Zc582vi/mCBMYNHLDAWIB3fVrRfAINaFXAUC0Zi/nBEtRkMOKbsL6dOjoQOgiBJt4OAqwoCA3QVgaBrCdobbfDHZjwReBFvZ7OP+xpxfbDf+K' +
  '/mf/S7n/SQMB4v/OLp+E2K0/nT4fsXXrbp+FMGVcKb8EmOWeZKwHT8MVeE6fR5X6vAmFLpJMIxxwbHCC0TEmlFSXZHFAwqArzOpJicYEVjhZQ90UqEI1Yy/Q' +
  'wqOOR57+Dp9IfSaL5vXelZ7xiHQZCrAHC2QdDJNrt6nq6zU3Se/FsneMHR0YinsJ++wyXrTW5y4ksHPCGwG+XR5MkD2ulD83mzhS0mVDrBwpCxH/XTRsYJJd' +
  '4viBTOYE3sn4HBOleA8Kn+NAQiEiqNmCpQxDphGZMbqJQfzQBDu9lHQaAJiUK1MjjYWryAGI7Rmy0iHAufkCZXAWqczAyLDoKw9tyTgsCyPTQdBkFZy6gGcI' +
  '0Gw78hnvgue74N2LgemX3qE8X10b7lfre+8Vu1fHnIvjDM1skJYEsn6cNtvQhyOq2xyfNa+z6POkzHn1d43q/zImFPEeNYC/cnAV5m8ivqvM+CPJMLqEkwim' +
  'zl2FinY1ayLBwll1A6PkWOixeEERhGrgjDAKcxfqtmABxCoQNPP8wOn5oXnBQIV1PzF2VsgmftT/D46+vx6PbhTxTXZ/uu+33ah4fiGYFdMpTn8dSP2jUnSG' +
  'Jc950Vzpk/24REFRw42ygItLJlcIyxsmchOgDmPQsxJkQKpgKkmO+RQRLl2AmRbCxEKkTghHbYWABDVO7AZ2vt/OBEcYAivmFgtQocQiHoNvvPPAjMQJwyED' +
  'oYzgr//KTgEcAfcj02+9ivEueCfcs9P+2zNvlThN04BBtZnsxS8ih7jOYEfuD4Yz5PSESRYZ/O35wgZ/7ZHyWNJukdStkznBG7JsFjYdR9kmJiqQBBWuFQEo' +
  'VwSM6Qz9lnyBak6fDBcjIUKudUvX8YBMK6/8Dx29EPA+EwQE7p3zqjXZT/gvEo4PmcA5Yk+Nywb7zXJTdZt2NP34wHhcjZPokwzghjs+QByv6qE8KT5Db82b' +
  'O0+pMqUUGgUfeauYIoKTSqDij7EvqMdPJQZoEzIDIAUv+ve4dsFQsWCzI7yBgTdOaY3nisMMy8nT0MOAwCqcerqZXArvKnjqz7Tw6E03SAwXfbMR55Lv1Inn' +
  '38N4hzzb7xLne6y2Z2ecjee/KAXgU2yvGdrS9GVJLMWxHSmoGytvITxQmcToot6eyTB4TN/EBLobONsRAUHEp4MyYPUJJgRQYCayW8kPLd5AJFiBVWhBhkc8' +
  'zIgrpyWIeubwKBODkn0KuBgYEpH3XKLbBtdtog+CszLgN+hHPMXHs4165Hf9+P/vBy0UUfhftLDMdNuAkzMFM+gzvzHjCn+w3MAAvclWg7WDxwD9wCM7D66Q' +
  '0bWF2ep4/ahjHvjQBtYIHbwGwDBkJgAzyQRRbNCdElFhC1RXK29YwwQIswE+aivNp6FCPAu+Cuj9ltdy6HN6jv6HGbVxkmLPupS4D6O/Kqmxe581Fm/IgZnH' +
  'PXxycEOlftqz7z7p89xDOG/J22gkFkrqAUolwhWvnx5AFeiTFCC80JMkMcniUTCW20smUpxEjyG8or7zVXgYY/sSvY01Ao8jllU8KQlUTqaCygBdxQ8gKYrb' +
  'R0dliN+cEwUeXTiLTqP4kIG6LtEBr1O1fBA94g8XDguZzD5jHgXL7+28t+4DmL+8dg/MrhDE+uCsIsejXweUHgzPvFhCF69Qj6M8FiVZUUmEeuBoEt2drAPF' +
  'cCD5y8z1UGG2CC/B7zgRDWYxgDuQBm67UKqFaEnqG9puT57NRmHapvNtZ+XGHS5Fc5Pk31Xl6Isv4u6oFfDuNj5DxXDufyZR/z1eJ8sKd+yiXrG27+Lk8L7E' +
  'tHzf5hSZLzCmPPysj7jc4FFDke3c7VIMslYjiDlEDHxPhbJCkujqApk4ZqBZiyJ7U6KAnvARleIHYI67xAkmO3hcAhrFeJcDBrZciY45r3yv7MEJ80k9thBj' +
  'itxg/N+q7fFd/8Tid49LWa0DpKhF19e/T97/XQvfzbBtywlJ/R5JgxWh6ttgjzfmZ9k/TOpNkoWDQKBhVZ7kSZYk1Z1GdiTCukbKp0eJT5goRSsHQyjAUbKx' +
  'KIzBiHY1rArORRAs97r1LrcujcglmO7BlQYNl2FempssCn2BvQZOEtPonuCziPzD7xa8X5Zv/9nvf+6Bj20i384o1Oks0aIWMfVUDXxXRbdAXpGEvKpgudGW' +
  '6nD3nVBxE1+1eARLbJBypLnBJnJcWSB8xny+pR5IiSSw3ikAtYrgIqZ1fP9kTdG9Ey6MmzvhmNdwCdQgY9tFfFsHsDv8t5ZvZxXynOR3vyPe5+o7esF718k9' +
  '9+yBhh7CmHzzxB5QRk6eTeZRNdPNfOXwFRxDjfqR1ilTGWvEmxKlmWDh/p6NoBS64Wlm1mg2MBupUK0mRAyFDN/rmt1IGQ99jB0el2mC2urrdVEMdhH/Cz23' +
  'G7F/A6zkOzj3mqOF/tf9zx/sfk9p1b8OAqkSjsPyJhTzQM2me7RY5nTqB5QecHIgNiBoIX3JnFc7aD4ShXhkySJRxKXqAFY+ny6fB8xzEcsWYdkQO5IuCp8V' +
  'dQtDqEoAvmHOVoZ4aBwwrSU6o9ls9mesH2Lv55wJ7z1OzjLxfnu/2n2z3gyUP22H1Y8QFGOX94w50ixgdJsV4NZjItS6KzinQbC6qaoZFwqGEQRK8QVT6tmC' +
  'QXJScgZ/8se8DmilGzv2uOSUy4ZEtLo2EYDn2uah+zXY6P5dXQRzoJGuVNNXw58ATOc7NP/LrBhWCPvNulnzPgWVv4upEwqEopxsFqkNCnN9qPOIRCMYoDzP' +
  'fT6XO2X5IYz+uAE/QqANoRif0t1ix/XuazppPPIHGM2RKOEvZYcgRVxSjgMuJgdbDW+0+9Ihzew2boi4BncwHYuiAuBPumH3z+sx9294e83kwvNHTMZCwGIT' +
  'J3IBaEQkjCTYSEI0TgZrgcMVJx3CB2GMKVmr0PLAxTgAWyAV7bGgdsgJFEdWAmYEEWGIYsgEFvcgckeh89vQkeRx4Je5Sfr433og3s8IiIxvo1kPeBTgAPEr' +
  'ycC8Tsk75+40Ky/3DXh975hOylQ3ZRZ4qzTqjUn5FbLBsCtRwazpZ5gP3YZYn0wqCL6GJkrsB3RHS1KOGEulZIqnogR7HrfQEJh/rYlMkXYEHYgRrkBYPcIU' +
  'BKnoCdlCUm+4oA28EKYFcg3Rv4US4gs1t9w54LzS6762fffgt+YK/lHUdUyUSRXptteJVGZFu7xbwL50opYjeDoEokUjpVyaTROQQig4IVsRZZBiZMsnBIUh' +
  'ysGD4d3aqQrlaUDhCTAQtmVAk1KB2fLo8GsOxHByrRG03cA/g5LjCzW2cAXGj2BXd56CdvWn9sH/5OQ8aWhHhYrQALTZSXcnz2LLNN0jtYiG1lpIN3rZAfEG' +
  'LlXmOUMmmqRun4B1slDS9ZNJ11vmdzNUjHzWDAkyc4yDAzYizNAbB2eqhgmOPl/M4dgV/hAjS77dNOcKHa533aZ9/hBOsPbbKL9qUOTYfPpJhlFjhPolPLoi' +
  'eSHEdvoSSyb+SJcUqoVGXUyjLo6idaAYo8ScIo+JMJM6Wz45jWA+KL5epA/zCbyVDdNxHuQLCDTTNXuPyuwM9ygZrd7il7LmS79E6fe+cR/op9+LFRx62EH2' +
  'SLOyNcx6gUDCrVx3O8K0cnF8hSibzPlWC2cphJtN4nzDqdnjlW2WHy2bVUMNAVoens5pgcIL+jHb/vszUw7ISwex7W8F+IK8DT38qFbg++5AvuOeQv2svXg4' +
  '00nQybJ0wUFIo1AySTYWM6fD7Pq0ofsoxCUceqJBFmrhRU6XTBo+nsec1Zv8oljOzHsMi2AiQcc8+N9QtWq8TbDoRN4gHAy7nAzSG40K/v/ulnvULmX+QGVq' +
  'XRpFWpMsKZY1jM9xSYDdxrI8wAC+gNLMiEWd0P8AAPVGXRNsA2IJBtYAMIzOY7YmAa4AMxx5DA87sswOdlpmzznjluHjjCTNX/RWbxcrPgQr9Ws+DI4MU/88' +
  '3Pvs+nftn7m3icAWaBGzgwzHGCwDAsHWmAF6QIwLByOBtYYXAfEDYdnSpO699HMA3CHJaBBoBjthEycFAYVp8zAwZAHaCLLfMddyEFhoGV8zsupmXOYHG+op' +
  'NcR2aXfMsbaTuye9zuYc/bhl+6Vbl0WJJi78zwlqfOJRcIJR/oIjr6BLl6XomuBiWy7qdOkOh9w5X1XaHutVZxHG7Zh2PhkBlkmBDJsxrU8IZBysAV3w08hC' +
  'MrYxUbbUf2DieOf94blhPvjekOJtXMjpmBYjqWB0QSTwsk7+PQzTAs70fidPIZLJzQ7JeRKwNIIKKSWVBQCwirtWcgGb3aAGbIY95C1wcpkiQH7g7i5256kx' +
  't9Hkd2YHa/F4kjO7Rbf+DnvusVLL8e4uJ9Et8T+JRDySMURx2rkleVVFdCTNmOygcss8VrNWjimzkEsWLDCVswLbkKWJZJ7/BKeGX+wMPAiyzXCpDJMZuB4G' +
  'aY/FVb7D4R+DeOjEMV6Ftfx8l2ZJ95u4d/1JXb7hf3w2/YewSMjUyIRZdGjNpIg7FtqQQpW1YijIhdB0HYbLMsQji9a2wBVkhI5FpKBu2EWCbBjAVswQsSyf' +
  'H6LhzHMPkVLrs18DucZEe27vxKTrYj+6Ff+Prf/fRP/u+XAc/r40cWLERimlQSDAio6kwXQigSEkVUwRsyQxpoWWBEboQ3JCEAS1KtAQbGIKAgVLagdG8l1B' +
  'IAwhAyIAwDwDDjMh05/ylt1TJ423ZkP/HrX/GCT/3Yx38yZg8jf+UdUn2xeS+LJJn1M0ija+89VZsAxAyArA7tHwkMADAnFGB0GXPeK2NJgHkemZjB0K7uYM' +
  '1Dpvm3BOP5nNKObA0bHNlV2Bvf+9H2jn/9CbB8CgaQM7wFfeLUfDYZKkd0QyMwM5SXaTDNwAGN3syljeS3WPbPIBiYgzDcDrZtpZ+P7BJoofMU/Mqb9//0aI' +
  '7sKm198/gHTm1H9v1/evftLp/yzEt1Qr8l0ztLByfpIBNKBUiafeSqIO+zO8V8ZkynRkZoIOvKTItAtXJEvac++dyE23woyDQbIS31iOCNwbj0ot077zmyq7' +
  'T1//wjcWRXbT/zG//l1bf58K97OGbPBoEdOrxcaMy+aYYyUywMmYOJiEBUYARmZBCAFGDk+9vBRnUV0HEQo2RQZGCkmUHX/D9c8CpOa0e2CnF6O7JX/sF/fu' +
  '4nf8Q33lWm+zOsdHsEDYWUcEgCApkRBFhCGjNYomb3hFKOiIYyGqAlxw2wakG9cwwERsIusIRVkr+YZXsOR3ZGtrJsHNmZ2c65bBu6VbjeRyEkgHR81AFhhm' +
  'So+swBAZH9AebIBAwkWs0xgLwviEQR4EAibQGjFaDZ/vUu4jLOwo5k0DjBkZ2Z/crvfcnrP+yDn3kZph+SIpUbCAsCR4nTFensGLijGOCG1M4sRdYDDTCQyD' +
  'GHXB2wXl0sLL9vYGrpU2Z9TrTpsrc6r+OM7cjWt+42ztyO7Ddf9QU/8r/bu4cA25JtC6Bjxd4X37Zt27bNfuPbtm3btm3bLjyj7KrME2t+PXXvzTz5FGMr0J' +
  '6dHXrtl/vuH0nlQ5OgyYaWQm+6ogUtSEqqKQJKmxSdDS2KKsZBepcKVTjQOzUxBKOKMEakC5H40cSvWq7J3n2wXJu+1B+Xk+0dw/NHRGukSrYwGyWJhAxmR8' +
  'TUokjJKLooUiUpUtQUGxVlilJFQiEmRWowpshth0v9ca7Zsp9ePXVtlr+88cNvfe0X+9FP6PQPxNAj0hEhLbVJIiIVMUGqSKRaj5IUmIPKEJMCElRJBjUFRs' +
  'iGUkoERD5xO3WLa7bU6//w71iuzyu91E/85sx4uycf0bQ7hNmbQ4aew/TEzXdLajfnRkpne9KTDOmB/y+z6R7KToaRHQOF3XhCX1WpHr+Dt7dcl306sVyftn' +
  '1c5G9b9ijTlGxa0HqUTktgkz5QpZV0SZEUUJGUrqCkYCqkpnQMQ0wZpTKlxuxt+zjLddvnVpbr88+PfM9/fqUX/flvb/2RU0noalE6JBGkIhWdElOyyWhdJX' +
  '3QtWFoTQbVIEpQhWo9dmaJKYXq7+DwT5brtqsHLGewP/S5OVz5EJXnjZJEixQZkSaJHpFqfSBVOkVaV0kGWmoqdEoNhNI6ZWxDTEYEzR2HvT7Hcib7yaW2XL' +
  '9/fOy73f4Kz/+bn9/pr+9iGpJotBZDi0qTIdU6dJEuilRLBj01VCQ7RcZgtkZhFNGq8vl7u81yJvvep5azuWe+0Lc+y3j8x3Tl5RK6okO0ViIOIlpqiEimVE' +
  'mGJGKjhlSpkGrVLb0rU9LUpkVV3fj8z/ei32I5s/35n+8FLWf1gofOj39BZ/v+mdZdonSI1lWSFvWkctuomAJ0RKN0IVNqoAGllFSp9Bc87tZHHixnVq/ykz' +
  '9oObsPev8bxh/83uP/aWa88lQ6Q3eZGTrDIUOqdA+dIRlaSe906afY7aEzVDbJUIbKwDBsYvv3//zHR7wa2nJm5fM+z3I+3uZtHvuBp3P7sTZ0hpnSXeYT6t' +
  '1DK0lJNp0SQ2xM2oaBTXpTCpsYho0e2D4EP245F/VyP/2dlvPzws/3N3/Xc7zmQYlNzzIztNIZYuh+QjklGToDQ9sUZNdK2ZjDqA2lsv8jXstybnZ1ajk/M/' +
  'WlkR9NSotUROmQtC66hmTq2kAQrVLawMSQFIOAoXp+ieVc7TIt5+clbrnlp256vuf/ktYvkypTSbdkmIVE0jpDRrQWUT10TYEMRCpKzGrVbr5pvuhPWc7Vfs' +
  'N8Icv5ucEHzNfxu1+Xytd3Iilz0DOS0hVBRrTWKEOPFoMO1dKUkmpsDF/7klcfPi3nql7yF77Kcr5eoP7jWU+fZXt4q+dtQ2aZ2TSSIYPuIRk6hUGGKMlAqW' +
  'x4Qrm32+f24Evifsu52g91r+V8PcaL3v88Hv8tkc/q0EVMydDVkiFP8ZWSmtJDKUSP8RSjx4dvrd7vd+6WvXp3/pY+HL619+3TVO9RWulEEK1T4oBNazFUtS' +
  '70oCdVIofLV/ZvcRTLvl8p52+530s95koe/ovJeJ8edEpXJBFDijSplippotCqSkYkbMkvHk5OH+Molv1wcuo4lsvP6tu68j7dpUXQRTpSKFKRRI9SQjZJMD' +
  'Fk822OZtmzteNY7nvohX7z6uXH35DKy6XpRGqIlgypCGRQkQopNQDTDVP/pqNZ9jkPjmeZne9P+YIeZJaIFBEJEhktobqoFuhSW77fUS27LY5pmT+c2j4/UU' +
  'Eq0kMqgqogoMdAGR0qsV/6YUe17PbN8SwPeuGbdo//k/BmQXeJgKSkIkoJQqaugfoT88GbHNWyz/mg41rG5oe0N2ukIiIGFQxJxCbVhKGo/JCjW3bVjmvJye' +
  'nP9H7pm1LZhGQwWisSRiGIpPTIvJzDzzi6Zd9z6tiWZ78leeBPUvUWSclolY2EajHIVAZbIX9yUtstjm7ZT8bm+JYx/Gymt0hFDDFRZEg1NaRCtxrj5ywXYl' +
  'dxfMvhsP/cGIeviSHdjBKoJqUaWxh0189aLsTeXZaLcPXmrvv+VferZBSIKBFDRiul4l/V6c2WZ7QVYUt3/6aqV1EBEskQoYoQ+U3LhdlbLBdk1G8k+RgKLU' +
  'oVFSKi1fAblguzG9NyMZ79ofF7d1+ZJ6UvJ0WViIxSHTh59ofye5YLsz/7Q7FcmPslPxs+KKJEqlRHCvzs3Zfdb7kw+92XLRdom/OzDvv2ttoLZCAtNRS3bL' +
  'M+y3Kh9m1aLtSVG+Y4vMnWvijJ25ci+a3D3p912NxouVD7Q5cPlgt349x9KEE89SzDM71lBWBZVgCWZQVgWVYAlmUFYFlWAJblGdt/A2TOtlULKso3AAAAAE' +
  'lFTkSuQmCC';

const CHATGPT_LOGO_DATA_URL =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxOTIgMTkyIiBmaWxsPSJub2' +
  '5lIj4KICA8ZyBzdHJva2U9IiMxMTExMTEiIHN0cm9rZS13aWR0aD0iMTQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZC' +
  'I+CiAgICA8ZWxsaXBzZSBjeD0iOTYiIGN5PSI1MiIgcng9IjI1IiByeT0iMTciLz4KICAgIDxlbGxpcHNlIGN4PSIxMzMuOSIgY3k9Ijc0IiByeD0iMjUiIH' +
  'J5PSIxNyIgdHJhbnNmb3JtPSJyb3RhdGUoNjAgMTMzLjkgNzQpIi8+CiAgICA8ZWxsaXBzZSBjeD0iMTMzLjkiIGN5PSIxMTgiIHJ4PSIyNSIgcnk9IjE3Ii' +
  'B0cmFuc2Zvcm09InJvdGF0ZSgxMjAgMTMzLjkgMTE4KSIvPgogICAgPGVsbGlwc2UgY3g9Ijk2IiBjeT0iMTQwIiByeD0iMjUiIHJ5PSIxNyIvPgogICAgPG' +
  'VsbGlwc2UgY3g9IjU4LjEiIGN5PSIxMTgiIHJ4PSIyNSIgcnk9IjE3IiB0cmFuc2Zvcm09InJvdGF0ZSg2MCA1OC4xIDExOCkiLz4KICAgIDxlbGxpcHNlIG' +
  'N4PSI1OC4xIiBjeT0iNzQiIHJ4PSIyNSIgcnk9IjE3IiB0cmFuc2Zvcm09InJvdGF0ZSgxMjAgNTguMSA3NCkiLz4KICA8L2c+CiAgPGNpcmNsZSBjeD0iOT' +
  'YiIGN5PSI5NiIgcj0iMTgiIGZpbGw9IiMxMTExMTEiLz4KPC9zdmc+';

const SYNC_SHORTCUTS_SOURCE_ID = 'tab-out-sync';
const SYNC_SHORTCUTS = [
  {
    id: 'local-shortcut-1',
    title: 'Gmail',
    url: 'https://mail.google.com/',
    logoMode: 'auto',
    logoDataUrl: '',
    logoTransform: { scale: 1, offsetX: 0, offsetY: 0 },
  },
  {
    id: 'local-shortcut-2',
    title: 'Scopus',
    url: 'https://www.scopus.com/pages/home?display=basic#basic',
    logoMode: 'upload',
    logoDataUrl: SCOPUS_LOGO_DATA_URL,
    logoTransform: { scale: 1, offsetX: 0, offsetY: 0 },
  },
  {
    id: 'local-shortcut-3',
    title: 'Perplexity',
    url: 'https://www.perplexity.ai/',
    logoMode: 'auto',
    logoDataUrl: '',
    logoTransform: { scale: 1, offsetX: 0, offsetY: 0 },
  },
  {
    id: 'local-shortcut-4',
    title: 'G-Scholar',
    url: 'https://scholar.google.com/',
    logoMode: 'auto',
    logoDataUrl: '',
    logoTransform: { scale: 1, offsetX: 0, offsetY: 0 },
  },
  {
    id: 'local-shortcut-5',
    title: 'bilibili',
    url: 'https://www.bilibili.com/',
    logoMode: 'auto',
    logoDataUrl: '',
    logoTransform: { scale: 1, offsetX: 0, offsetY: 0 },
  },
  {
    id: 'local-shortcut-6',
    title: 'Inoreader',
    url: 'https://www.inoreader.com/',
    logoMode: 'auto',
    logoDataUrl: '',
    logoTransform: { scale: 1, offsetX: 0, offsetY: 0 },
  },
  {
    id: 'local-shortcut-7',
    title: 'UQ Library',
    url: 'https://www.library.uq.edu.au/',
    logoMode: 'auto',
    logoDataUrl: '',
    logoTransform: { scale: 1, offsetX: 0, offsetY: 0 },
  },
  {
    id: 'local-shortcut-8',
    title: 'NotebookLM',
    url: 'https://notebooklm.google.com/?hl=en',
    logoMode: 'upload',
    logoDataUrl: NOTEBOOKLM_LOGO_DATA_URL,
    logoTransform: { scale: 1, offsetX: 0, offsetY: 0 },
  },
  {
    id: 'local-shortcut-9',
    title: 'Claude',
    url: 'https://claude.ai/',
    logoMode: 'auto',
    logoDataUrl: '',
    logoTransform: { scale: 1, offsetX: 0, offsetY: 0 },
  },
  {
    id: 'local-shortcut-10',
    title: 'Blackboard',
    url: 'https://learn.uq.edu.au/ultra/course',
    logoMode: 'upload',
    logoDataUrl: BLACKBOARD_LOGO_DATA_URL,
    logoTransform: { scale: 1, offsetX: 0, offsetY: 0 },
  },
  {
    id: 'local-shortcut-11',
    title: 'Gemini',
    url: 'https://gemini.google.com/',
    logoMode: 'upload',
    logoDataUrl: GEMINI_LOGO_DATA_URL,
    logoTransform: { scale: 1, offsetX: 0, offsetY: 0 },
  },
  {
    id: 'local-shortcut-12',
    title: 'ChatGPT',
    url: 'https://chatgpt.com/',
    logoMode: 'upload',
    logoDataUrl: CHATGPT_LOGO_DATA_URL,
    logoTransform: { scale: 1, offsetX: 0, offsetY: 0 },
  },
  {
    id: 'local-shortcut-13',
    title: 'GitHub',
    url: 'https://github.com/Xiaotian-Liu-MKT',
    logoMode: 'auto',
    logoDataUrl: '',
    logoTransform: { scale: 1, offsetX: 0, offsetY: 0 },
  },
  {
    id: 'local-shortcut-14',
    title: 'Prolific',
    url: 'https://app.prolific.com/',
    logoMode: 'auto',
    logoDataUrl: '',
    logoTransform: { scale: 1, offsetX: 0, offsetY: 0 },
  }
];
