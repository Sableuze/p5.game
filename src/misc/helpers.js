
export const playMusic = (music) => {
    music.play()
}

export const stopMusic = (music) => {
    music.stop()
}
export const checkObjectsCollision =(obj1X, obj1Y, obj1W, obj1H, obj2X, obj2Y, obj2W, obj2H) => {

    let XColl = false;
    let YColl = false
    if ((obj1X + obj1W >= obj2X) && (obj1X <= obj2X + obj2W)) XColl = true;
    if ((obj1Y + obj1H >= obj2Y) && (obj1Y <= obj2Y + obj2H)) YColl = true;

    if (XColl && YColl) {
        return true;
    }
    return false
}
