export default class AudioAnalysisUtilities {
  static getWeightedVolumeAverageForSegment(currentSegment, recentSegments, maxLoudness) {
    //Get the average loudness sample from the set of recent samples
    const averageRecent = recentSegments.reduce((a, b) => a + b, 0) / recentSegments.length;

    //1.) Get a comparison with the recent average
    const comparisonWithRecentAverage = Math.abs(currentSegment.loudness_start / averageRecent);

    //2.) Get a comparison with the last sample
    const comparisonWithLast = Math.abs(currentSegment.loudness_start / recentSegments[recentSegments.length - 1]);

    //3.) Get a strong comparison with the sample that contained the max loudness
    const comparisonWithMaxLoudness = Math.pow(Math.abs(maxLoudness / currentSegment.loudness_start), 1.7);

    //Compute a weighted volume average
    const weightedVolumeAverage =
      0.4 * comparisonWithLast + 0.4 * comparisonWithRecentAverage + 0.2 * comparisonWithMaxLoudness;

    return weightedVolumeAverage;
  }
}
