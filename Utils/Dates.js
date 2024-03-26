const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];



const GetCurrentTime = () =>{
    const d = new Date();
    let name = month[d.getMonth()];
    let day = d.getDay();
    let year = d.getFullYear();
    return `${day} ${name} ${year}`;
}

module.exports = GetCurrentTime;