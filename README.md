# ⟠ use-infinite-data ⟠

A library to get data infinite

## Installation

```
npm install @dapp-builder/use-infinite-data
yarn add @dapp-builder/use-infinite-data

```

## Example

```typescript
import { useEffect, useState } from "react";
import useInfiniteData from "use-infinite-data";

const ExampleComponent = () => {
  const [query, setQuery] = useState({});

  const { loading, items, hasMore, nextPage } = useInfiniteData(query, {
    caller: async (args) => {
      const response = await fetch(`https://api.example.com/data`, {
        method: "POST",
        body: JSON.stringify(args),
      });
      return response.json();
    },
  });

  console.log(items, loading)
};

```

## Supports

Caller response format: {
  data: {
    items: [],
    total: 0,
    page: 0,
    limit: 0,
    totalPages: 0
  }
}