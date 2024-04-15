export class ElementsCreator {
  private elements: {
    tagName: string
    attributes: Record<string, string>
  }[]

  constructor(
    elements: {
      tagName: string
      attributes: Record<string, string>
    }[],
  ) {
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
