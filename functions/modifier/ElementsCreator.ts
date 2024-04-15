export type ElementCreation = {
  tagName: string
  attributes: Record<string, string>
}

export class ElementsCreator {
  private elements: ElementCreation[]

  constructor(elements: ElementCreation[]) {
    this.elements = elements
  }

  element(element: Element) {
    for (const { tagName, attributes } of this.elements) {
      element.append(
        `<${tagName} ${Object.entries(attributes)
          .map(([key, value]) => `${key}="${value}"`)
          .join(' ')}></${tagName}>`,
        { html: true },
      )
    }
  }
}
