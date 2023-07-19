describe("Customer functions", () => {
  const amountToDeposit = 500;
  const currentDate = new Date();
  const customers = ["Hermoine Granger", "Harry Potter", "Ron Weasly", "Albus Dumbledore", "Neville Longbottom"];

  customers.forEach(($customer) => {
    specify(`Customer ${$customer} logs in`, () => {
      cy.visit("/");
      cy.contains("Customer Login").click();

      cy.get("#userSelect").select($customer);
      cy.contains("Login").click();

      cy.contains($customer).should("be.visible");
    });

    specify("Balance should be shown", () => {
      cy.contains("Balance :")
        .should("be.visible")
        .then(($elem) => {
          expect($elem.text()).to.match(/Balance : (\d+) ,/);
        });
    });

    specify("An amount should be deposited", () => {
      cy.contains("Balance :")
        .should("be.visible")
        .then(($elem) => {
          const startingBalance = $elem.text().match(/Balance : (\d+) ,/)[1];

          cy.contains("Deposit").click();
          cy.contains("Amount to be Deposited :").should("be.visible");

          cy.get(".form-group").get("input").type(amountToDeposit);
          cy.get(".form-group").get("form").submit();

          cy.contains("Deposit Successful").should("be.visible");
          cy.contains("Balance :")
            .should("be.visible")
            .then(($elem) => {
              const newBalance = $elem.text().match(/Balance : (\d+) ,/)[1];
              expect(parseInt(newBalance)).to.equal(parseInt(startingBalance) + amountToDeposit);
            });
        });
    });

    specify("The transaction should show up in the history", () => {
      cy.wait(1000);
      cy.contains("Transactions").click();
      cy.contains("Date-Time").click({ force: true });

      cy.get("tbody > tr > td:first").then(($td) => {
        const dateFromTable = new Date($td.text()).toDateString();
        expect(dateFromTable).to.equal(currentDate.toDateString());
      });
      cy.get("tbody > tr:first > td:nth-child(2)").should("have.text", amountToDeposit);
    });
  });
});
