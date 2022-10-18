/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./dist/*.{html,js}",
        "./dist/*.html",
    ],
    darkMode: 'class',
    theme: {
        fontSize: {
            tiny: ['0.6rem', { lineHeight: '1rem' }],
            des: ['0.65rem', { lineHeight: '1rem' }],
            xs: ['0.75rem', { lineHeight: '1rem' }],
            sm: ['0.875rem', { lineHeight: '1.25rem' }],
            base: ['1rem', { lineHeight: '1.5rem' }],
            md: ['1rem', { lineHeight: '1.5rem' }],
            lg: ['1.125rem', { lineHeight: '1.75rem' }],
            xl: ['1.25rem', { lineHeight: '1.75rem' }],
            '2xl': ['1.5rem', { lineHeight: '2rem' }],
            '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
            '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
            '5xl': ['3rem', { lineHeight: '1' }],
            '6xl': ['3.75rem', { lineHeight: '1' }],
            '7xl': ['4.5rem', { lineHeight: '1' }],
            '8xl': ['6rem', { lineHeight: '1' }],
            '9xl': ['8rem', { lineHeight: '1' }], 
        },
        fontFamily: {
            content: ['ui-sans-serif','system-ui','-apple-system','BlinkMacSystemFont','"Segoe UI"','Roboto','"Helvetica Neue"','"Helvetica"','"Noto Sans"','sans-serif','"Apple Color Emoji"','"Segoe UI Emoji"','"Segoe UI Symbol"','"Noto Color Emoji"','"-webkit-pictograph"','"Content"','cursive','Arial'],
            sans: ['ui-sans-serif','system-ui','-apple-system','BlinkMacSystemFont','"Segoe UI"','Roboto','"Helvetica Neue"','Arial','"Noto Sans"','sans-serif','"Apple Color Emoji"','"Segoe UI Emoji"','"Segoe UI Symbol"','"Noto Color Emoji"'],
            doc: ['"Source Sans Pro"','sans-serif','Inter var','ui-sans-serif','system-ui','-apple-system','BlinkMacSystemFont','"Segoe UI"','Roboto',"'Helvetica Neue'",'Arial',"'Noto Sans'",'sans-serif',"'Apple Color Emoji'","'Segoe UI Emoji'","'Segoe UI Symbol'","'Noto Color Emoji'",'"Noto Serif Khmer"','serif'],
            jetBrain: ['"JetBrains Mono"','monospace'],
            "openSans":['"Open Sans"','sans-serif'],
            "roboto":['"Roboto"','sans-serif']
        },
        boxShadow: {
            sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
            DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
            md: '-40px 40px 160px 0 rgb(0 0 0 / 2%), -8px 8px 15px 0 rgb(120 120 120 / 4%), 3px 3px 30px 0 rgb(0 0 0 / 4%)',
            lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
            xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
            '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
            inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
            none: 'none',
        },
        extend: {
            animation: {
                'slideInDown': 'slideInDown 1s both',
                'slideInUp': 'slideInUp 1s both',
                'slideInLeft': 'slideInLeft 1s both',
                'dropdown': 'dropdown 0.5s both',
                'fadeIn': 'fadeIn 0.5s',
            },
            keyframes: {
                'dropdown': {
                    '0%': { 
                        transform: 'translate3d(0, -10%, 0)' ,
                        visibility: 'visible'
                    },
                    'to': { 
                        transform: 'translateZ(0)' 
                    },
                },
                'slideInDown': {
                    '0%': { 
                        transform: 'translate3d(0, -100%, 0)' ,
                        visibility: 'visible'
                    },
                    'to': { 
                        transform: 'translateZ(0)' 
                    },
                },
                'slideInUp': {
                    '0%': { 
                        transform: 'translate3d(0, 100%, 0)' ,
                        visibility: 'visible'
                    },
                    'to': { 
                        transform: 'translateZ(0)' 
                    },
                },
                'slideInLeft': {
                    '0%': { 
                        transform: 'translate3d(100%, 0, 0)' ,
                        visibility: 'visible'
                    },
                    'to': { 
                        transform: 'translateZ(0)' 
                    },
                },
                'fadeIn': {
                    from: { 
                        opacity: 0
                    },
                    to: { 
                        opacity: 1 
                    },
                },
            }
        }
    },
    plugins: [
        require('@tailwindcss/line-clamp'),
        require('@tailwindcss/aspect-ratio')
    ],
    variants: {
        lineClamp: ['responsive', 'hover'],
    }
}
