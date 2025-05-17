// styles.ts
export const htmlStyles = `
  body {
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f5f5f5;
    color: #333;
  }

  header {
    text-align: center;
    padding: 20px;
    background: #0d6efd;
    color: white;
  }

  .tabs {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
  }

  .tab-button {
    padding: 10px 20px;
    cursor: pointer;
    background: #dee2e6;
    border: none;
    border-radius: 4px;
    font-weight: bold;
  }

  .tab-button.active {
    background: #0d6efd;
    color: white;
  }

  .tab-content {
    display: none;
    padding-bottom: 20px;
  }

  .tab-content.active {
    display: block;
  }

  .summary {
    text-align: center;
    font-size: 18px;
    margin: 15px 0;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    padding: 20px;
  }

  .grid-column {
    background: white;
    padding: 10px;
    box-shadow: 0 0 10px rgba(0,0,0,0.05);
    border-radius: 8px;
    text-align: center;
  }

  .grid-column h3 {
    margin-top: 0;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
    font-size: 18px;
  }

  .grid-column img {
    max-width: 100%;
    border-radius: 6px;
    box-shadow: 0 0 8px rgba(0,0,0,0.1);
  }

  @media screen and (max-width: 900px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }
`;
