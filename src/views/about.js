export default async function renderAbout() {

    //fetch data from server
    const data = await fetch('http//localhost/api/index.php');
    const aboutData = await data.json();
    console.log(aboutData);

    const aboutDiv = document.createElement('div');
    aboutDiv.textContent = 'Learn more About us!';
    return aboutDiv;
}
