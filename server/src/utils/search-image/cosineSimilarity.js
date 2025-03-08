const tf = require("@tensorflow/tfjs"); // Sử dụng phiên bản Web

/** Tính cosine similarity giữa hai vector */
function cosineSimilarity(vecA, vecB) {
    return tf.tidy(() => {
        const dotProduct = tf.sum(tf.mul(vecA, vecB));
        const magnitudeA = tf.norm(vecA);
        const magnitudeB = tf.norm(vecB);
        return dotProduct.div(magnitudeA.mul(magnitudeB)).dataSync()[0];
    });
}
module.exports = cosineSimilarity