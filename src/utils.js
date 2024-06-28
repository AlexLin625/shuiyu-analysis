export const b50labels = [
    "10",
    "10+",
    "11",
    "11+",
    "12",
    "12+",
    "13",
    "13+",
    "14",
    "14+",
    "15",
];

export function achievement2Coeff(ache) {
    if (ache >= 100.5) return 22.4;
    else if (ache >= 100.0) return 21.6;
    else if (ache >= 99.5) return 21.1;
    else if (ache >= 99.0) return 20.8;
    else if (ache >= 98.0) return 20.3;
    else if (ache >= 97.0) return 20.0;
    else if (ache >= 94.0) return 16.8;
    else if (ache >= 90.0) return 13.6;
    else if (ache >= 80.0) return 12.8;
}

export function achievement2Rating(ache, ds) {
    return Math.floor(
        achievement2Coeff(ache) * ds * Math.min(100.5, ache) * 0.01
    );
}

export function getBaseline(ds, b50min) {
    if (achievement2Rating(100.5, ds) < b50min) return 101.0;
    if (achievement2Rating(97.0, ds) > b50min) return 97.0;

    let l = 85;
    let r = 100.5;

    while (r - l > 0.01) {
        let mid = (l + r) / 2.0;
        let ra = achievement2Rating(mid, ds);
        if (ra >= b50min) {
            r = mid;
        } else {
            l = mid;
        }
    }

    return r;
}

export function ds2level(ds) {
    let i = Math.trunc(ds);
    let f = ds - i;

    let level = i.toString();
    if (f > 0.6) {
        level += "+";
    }

    return level;
}

export function ds2index(ds) {
    let i = Math.trunc(ds);
    let f = ds - i;
    let off = 0;

    if (f > 0.6) off = 1;

    return (i - 10) * 2 + off;
}

export function minmaxFromList(list) {
    let maxRating = 0;
    let minRating = 1000000;

    for (let i = 0; i < list.length; i++) {
        maxRating = Math.max(maxRating, list[i].ra);
        minRating = Math.min(minRating, list[i].ra);
    }

    return {
        minRating: minRating,
        maxRating: maxRating
    }
}

export function getHistogram(list) {
    let hist = [];
    for (let i = 0; i < 11; i++)
        hist.push(0);

    for (let i = 0; i < list.length; i++) {
        let idx = ds2index(list[i].ds);
        hist[idx]++;
    }

    return hist;
}

export function computeBaseline(bmin) {
    let baseline = [];
    for (let i = 10; i <= 15; i++) {
        baseline.push(getBaseline(i + 0.2, bmin));
        if (i !== 15) {
            baseline.push(getBaseline(i + 0.7, bmin));
        }
    }
    return baseline;
}

export function getAverageRating(list) {
    let hist = [];
    let sum = [];
    for (let i = 0; i < 11; i++) {
        hist.push(0);
        sum.push(0);
    }

    for (let i = 0; i < list.length; i++) {
        let idx = ds2index(list[i].ds);
        hist[idx]++;
        sum[idx] += list[i].achievements;
    }

    for (let i = 0; i < sum.length; i++) {
        sum[i] = sum[i] / hist[i];
    }

    return sum;
}