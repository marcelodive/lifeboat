window.onload = () => {
    console.log("Hosted by 000webhost");
    const divs = document.getElementsByTagName('div');
    for (const div of divs) { 
        if (div.innerHTML.includes('000webhost')) div.remove(); 
    }
};