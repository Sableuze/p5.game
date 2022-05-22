export const backTimer = (target) => {
    const hours = target > 0 ? Math.floor(target /1000/ 60 / 60) : 0;
    const minutes = target > 0 ? Math.floor(target / 1000 / 60) % 60 : 0;
    const seconds = target > 0 ? Math.floor(target / 1000) % 60 : 0;
    return {hours, seconds, minutes}
}
