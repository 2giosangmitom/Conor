declare module "text-readability" {
  export interface ReadabilityApi {
    syllableCount(text: string, lang?: string): number;
    lexiconCount(text: string, removePunctuation?: boolean): number;
    sentenceCount(text: string): number;
    fleschReadingEase(text: string): number;
    fleschKincaidGrade(text: string): number;
    colemanLiauIndex(text: string): number;
    automatedReadabilityIndex(text: string): number;
    daleChallReadabilityScore(text: string): number;
    difficultWords(text: string): number;
    linsearWriteFormula(text: string): number;
    gunningFog(text: string): number;
    smogIndex(text: string): number;
    textStandard(text: string, floatOutput?: boolean): string | number;
  }

  const rs: ReadabilityApi;
  export default rs;
}
