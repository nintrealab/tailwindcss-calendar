# tailwindcss-calendar [![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fnintrealab%2Ftailwindcss-calendar.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fnintrealab%2Ftailwindcss-calendar?ref=badge_shield)
This `tailwindcss-calendar` package modified by [Sophat Leat](https://github.com/pphatDev) using [TailwindCss](https://github.com/tailwindlabs/tailwindcss) Style and [EvoCanlendar](https://github.com/edlynvillegas/evo-calendar) for JS.
I have tried to search for TailwindCss-Calendar but not I can find what I want.  So I decided to build this this small package and Publish it to NodeJS Server [`(npm)`](https://www.npmjs.com/).

# Installation
To install Package let's follow the these steps

## <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Logo.png" width="90px"/>
Full HTML Project
```ruby
git clone https://github.com/nintrealab/tailwindcss-calendar.git

```
go to project directory

```ruby
cd tailwindcss-calendar

```

## <img src="https://raw.githubusercontent.com/npm/logos/cc343d8c50139f645d165aedfe4d375240599fd1/npm%20logo/npm-logo-black.svg" width="90px"/> 


```js
npm install -D tailwindcss-calendar
// OR
npm i -D tailwindcss-calendar

```
TailwindCss Calendar Source
```
cd node_modules/tailwindcss-tailwindcss/src
```
Compiled Style TailwindCss Calendar Source
```
cd node_modules/tailwindcss-tailwindcss/dist
```

## CDN


> **Note**: CDN Can't Customize New CSS


Basic HTML
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TailwindCss Calendar</title>

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss-calendar/dist/css/calendar.css">
</head>
<body>
    
    <div 
        id="evoCalendar" 
        class="evoCalendar border w-full dark"
    ></div>

    <!-- Requried Jquery -->
    <script src="https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/tailwindcss-calendar/dist/js/evo-calendar.js"></script>
    <!-- Options -->
    <script>
        $("#evoCalendar").evoCalendar(
        {
            language                : 'en', // km
            sidebarDisplayDefault   : true, // false
            calendarEvents: [
                {
                    id          : '1',              // Event's ID (required)
                    name        : "New Year",       // Event name (required)
                    date        : "October/1/2022", // Event date (required)
                    type        : "holiday",        // Event type (required)
                    everyYear   : true,             // Same event every year (optional)
                    color       : "pink"            // optional
                },
                {
                    id          : '2',
                    name        : "Event Name Event Name Event Name",
                    date        : ["October/13/2022", "October/15/2022"], // Date range
                    description : "Description",
                    badge       : "3Days",
                    type        : "event",
                    color       : "red"
                }
            ]
        });
    </script>
</body>
</html>

```

##  [License MIT](https://github.com/nintrealab/tailwindcss-calendar/blob/main/LICESNSE)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fnintrealab%2Ftailwindcss-calendar.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fnintrealab%2Ftailwindcss-calendar?ref=badge_large)


