function formatTime(time)
{
    const date = new Date(time*1000)
    const year = date.getFullYear()
    const month = (date.getMonth()+1).toString().padStart(2," ")
    const day = date.getDate().toString().padStart(2," ")
    const hour = date.getHours().toString().padStart(2," ")
    const minute = date.getMinutes().toString().padStart(2," ")
    const second = date.getSeconds().toString().padStart(2," ")

    return `${year} ${month} ${day} ${hour} ${minute} ${second}`
}
export default
{
    formatTime
}
