// // Define our labelmap
// const labelMap = {
//     1:{name:'ThumbsUp', color:'red'},
//     2:{name:'ThumbsDown', color:'yellow'},
//     3:{name:'ThankYou', color:'lime'},
//     4:{name:'LiveLong', color:'blue'},
// }

// Define our labelmap
const labelMap = {
    1: { name: 'go', color: 'lime' },
    2: { name: 'stop', color: 'red' },
}

// Define a drawing function
export const drawRect = (boxes, classes, scores, threshold, imgWidth, imgHeight, ctx) => {
    for (let i = 0; i <= boxes.length; i++) {
        if (boxes[i] && classes[i] && scores[i] > threshold) {
            // Extract variables
            // const [y, x, height, width] = boxes[i]
            const [y, x, y2, x2] = boxes[i]
            const text = classes[i]

            // Set styling
            ctx.strokeStyle = labelMap[text]['color']
            ctx.lineWidth = 5
            ctx.fillStyle = 'white'
            ctx.font = '30px Arial'

            // DRAW!!
            ctx.beginPath()
            ctx.fillText(labelMap[text]['name'] + ' - ' + Math.round(scores[i] * 100) / 100, x * imgWidth, y * imgHeight - 10)
            // ctx.rect(x * imgWidth, y * imgHeight, width * imgWidth / 4, height * imgHeight / 4);
            ctx.rect(x * imgWidth, y * imgHeight, (x2-x) * imgWidth, (y2-y) * imgHeight );
            // ctx.rect(x * imgWidth, y * imgHeight, width, height);
            // console.log({ width, height });
            ctx.stroke()
        }
    }
}