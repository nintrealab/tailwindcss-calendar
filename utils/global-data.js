export const getGlobalData = () => {
    const name = process.env.BLOG_NAME 
        ? decodeURI(process.env.BLOG_NAME) : 'Unkhown';
    const blogTitle = process.env.BLOG_TITLE 
        ? decodeURI(process.env.BLOG_TITLE) : 'Unkhown';
    const footerText = process.env.BLOG_FOOTER_TEXT 
        ? decodeURI(process.env.BLOG_FOOTER_TEXT) : 'Unkhown';
    const image = process.env.BLOG_IMG 
        ? decodeURI(process.env.BLOG_IMG) : 'Unkhown';
    return {
        name,
        image,
        blogTitle,
        footerText,
    };
};
