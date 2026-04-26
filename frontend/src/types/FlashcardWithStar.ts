export default interface FlashcardWithStar {
    database_id: number,
    front: string,
    back: string,
    langFront: string,
    langBack: string,
    isStarred: boolean
}