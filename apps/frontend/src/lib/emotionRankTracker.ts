export interface RankTrackItem {
    emotion: string;
    url: string;
    targetKeyword: string;
}

export const emotionRankTrackingData: RankTrackItem[] = [
    {
        emotion: "alone",
        url: "/i-feel-alone",
        targetKeyword: "i feel alone"
    },
    {
        emotion: "empty",
        url: "/i-feel-empty",
        targetKeyword: "i feel empty inside"
    },
    {
        emotion: "lost",
        url: "/i-feel-lost",
        targetKeyword: "i feel lost and confused"
    },
    {
        emotion: "broken",
        url: "/i-feel-broken",
        targetKeyword: "i feel broken"
    },
    {
        emotion: "numb",
        url: "/i-feel-numb",
        targetKeyword: "i feel numb and empty"
    },
    {
        emotion: "anxious",
        url: "/i-feel-anxious",
        targetKeyword: "i feel anxious for no reason"
    },
    {
        emotion: "worthless",
        url: "/i-feel-worthless",
        targetKeyword: "i feel worthless"
    },
    {
        emotion: "disconnected",
        url: "/i-feel-disconnected",
        targetKeyword: "i feel disconnected from everyone"
    },
    {
        emotion: "invisible",
        url: "/i-feel-invisible",
        targetKeyword: "i feel invisible to everyone"
    },
    {
        emotion: "overwhelmed",
        url: "/i-feel-overwhelmed",
        targetKeyword: "i feel overwhelmed by everything"
    }
];
