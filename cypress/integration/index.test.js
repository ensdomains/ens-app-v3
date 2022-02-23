describe("Profile", () => {
  before(() => {
    cy.setupMetamask();
  });
  it("should allow user to connect", () => {
    cy.visit("/");
    cy.contains("Connect").click();
    cy.contains("MetaMask").click();
    cy.acceptMetamaskAccess();

    // replace with data-testid when design system supports it
    cy.contains("0x").click();
    cy.contains("My Profile").should("be.visible");
    cy.contains("0x").click();
    cy.contains("My Profile").should("not.be.visible");
  });

  it("should allow user to search profile", () => {
    cy.visit("/");
    cy.contains("Connect").click();
    cy.contains("MetaMask").click();

    cy.get('[placeholder="Search for a name"]').type("jefflau");
    cy.get('[data-testid="search-button"]', {
      timeout: 15000,
    }).click();

    cy.get('[data-testid="address-profile-button-eth"]', {
      timeout: 15000,
    }).should("has.text", "0x866...95eEE");
  });
});
