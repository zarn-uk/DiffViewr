export type FormatLandingKey = "yaml" | "json" | "env";

export type FormatLandingContent = {
  key: FormatLandingKey;
  route: string;
  eyebrow: string;
  formatLabel: string;
  title: string;
  description: string;
  intro: string[];
  sampleCtaLabel: string;
  sampleTitle: string;
  sampleDescription: string;
  referenceLabel: string;
  targetLabel: string;
  referenceSample: string;
  targetSample: string;
  benefits: Array<{
    label: string;
    text: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
};

const yamlReference = `services:
  api:
    image: ghcr.io/acme/payments-api:1.8.2
    ports:
      - "8080:8080"
    environment:
      LOG_LEVEL: info
      FEATURE_AUDIT: "true"
      REDIS_URL: redis://redis:6379
    deploy:
      replicas: 2
  worker:
    image: ghcr.io/acme/payments-worker:1.8.2
    environment:
      QUEUE_NAME: payments
      LOG_LEVEL: info
`;

const yamlTarget = `services:
  worker:
    environment:
      LOG_LEVEL: info
      QUEUE_NAME: payments
    image: ghcr.io/acme/payments-worker:1.8.2
  api:
    deploy:
      replicas: 3
    environment:
      REDIS_URL: redis://redis:6379
      FEATURE_AUDIT: "true"
      PAYMENT_TIMEOUT_SECONDS: "45"
      LOG_LEVEL: debug
    image: ghcr.io/acme/payments-api:1.9.0
    ports:
      - "8080:8080"
`;

const jsonReference = `{
  "name": "@acme/checkout-api",
  "version": "2.4.0",
  "scripts": {
    "start": "node server.js",
    "worker": "node worker.js"
  },
  "config": {
    "api": {
      "baseUrl": "https://staging-api.acme.test",
      "timeoutMs": 5000
    },
    "features": {
      "checkoutV2": false,
      "auditTrail": true
    },
    "limits": {
      "maxCartItems": 50,
      "retryCount": 2
    }
  },
  "dependencies": {
    "fastify": "4.27.0",
    "zod": "3.23.8"
  }
}
`;

const jsonTarget = `{
  "dependencies": {
    "zod": "3.23.8",
    "fastify": "4.28.1"
  },
  "config": {
    "limits": {
      "retryCount": 3,
      "maxCartItems": 50
    },
    "features": {
      "auditTrail": true,
      "checkoutV2": true
    },
    "api": {
      "timeoutMs": 8000,
      "baseUrl": "https://api.acme.com"
    }
  },
  "scripts": {
    "worker": "node worker.js",
    "start": "node server.js"
  },
  "version": "2.4.0",
  "name": "@acme/checkout-api"
}
`;

const envReference = `NODE_ENV=staging
API_BASE_URL=https://staging-api.diffviewr.com
LOG_LEVEL=debug
FEATURE_AUDIT=true
PAYMENT_PROVIDER=stripe_test
CACHE_TTL_SECONDS=300
`;

const envTarget = `NODE_ENV=production
API_BASE_URL=https://api.diffviewr.com
LOG_LEVEL=info
FEATURE_AUDIT=true
PAYMENT_PROVIDER=stripe_live
PAYMENT_PROVIDER=stripe_backup
CACHE_TTL_SECONDS=900
`;

export const formatLandingPages: Record<FormatLandingKey, FormatLandingContent> = {
  yaml: {
    key: "yaml",
    route: "/yaml-diff/",
    eyebrow: "YAML diff",
    formatLabel: "YAML",
    title: "YAML Diff Tool",
    description:
      "Compare YAML configuration files in your browser, align Target B to Template A, and catch duplicate mapping keys before review.",
    intro: [
      "YAML config drift is hard to review when service blocks move around or deployment values are nested several levels deep.",
      "DiffViewr parses YAML as configuration, aligns Target B to the structure of Template A, and highlights the real changes without treating duplicate keys as acceptable parser behavior."
    ],
    sampleCtaLabel: "Try Example",
    sampleTitle: "Docker Compose style YAML sample",
    sampleDescription:
      "The sample changes the API image tag, replica count, log level, and adds a payment timeout while keeping reordered service blocks readable.",
    referenceLabel: "compose.staging.yml",
    targetLabel: "compose.production.yml",
    referenceSample: yamlReference,
    targetSample: yamlTarget,
    benefits: [
      {
        label: "Nested mappings",
        text: "Service, environment, and deploy blocks stay scoped so repeated keys in different objects remain valid."
      },
      {
        label: "Strict duplicates",
        text: "Duplicate keys inside the same YAML mapping are blocked before comparison."
      },
      {
        label: "Reviewable output",
        text: "Target B can be copied back with key order aligned to the template."
      }
    ],
    faqs: [
      {
        question: "Does DiffViewr support YAML duplicate keys?",
        answer:
          "It detects duplicate keys within the same YAML mapping and treats the file as invalid. Same key names in different nested mappings are valid."
      },
      {
        question: "Are YAML arrays compared as duplicate values?",
        answer:
          "No. Duplicate values inside YAML lists are allowed. The duplicate-key rule only applies to mapping keys."
      },
      {
        question: "Are comments and anchor syntax preserved in the aligned output?",
        answer:
          "The parser can read standard YAML structures, but the aligned output is normalized config text. Source comments and exact anchor syntax should not be treated as preserved formatting."
      },
      {
        question: "Can I compare Kubernetes or Docker Compose YAML?",
        answer:
          "Yes for single YAML documents that parse as mappings or lists. Multi-document streams are not the intended input for this comparer."
      }
    ]
  },
  json: {
    key: "json",
    route: "/json-diff/",
    eyebrow: "JSON diff",
    formatLabel: "JSON",
    title: "JSON Diff Tool",
    description:
      "Compare JSON configuration files with key-order alignment, nested object awareness, and strict duplicate-key validation.",
    intro: [
      "JSON diffs get noisy when package-style or application settings files reorder nested objects before a release.",
      "DiffViewr uses Template A as the source of truth, aligns Target B to that structure, and keeps strict JSON validation in front of the comparison."
    ],
    sampleCtaLabel: "Try Example",
    sampleTitle: "Package config JSON sample",
    sampleDescription:
      "The sample changes API endpoints, timeouts, feature flags, retry count, and a dependency version while Target B arrives in a different key order.",
    referenceLabel: "package.staging.json",
    targetLabel: "package.production.json",
    referenceSample: jsonReference,
    targetSample: jsonTarget,
    benefits: [
      {
        label: "Strict JSON",
        text: "Comments, trailing commas, and JSON5 syntax are rejected so the comparison matches production parsers."
      },
      {
        label: "Scoped keys",
        text: "Duplicate object keys are invalid only within the same object scope."
      },
      {
        label: "Nested review",
        text: "Deep settings changes are easier to inspect after key order is normalized."
      }
    ],
    faqs: [
      {
        question: "Does the JSON comparer support comments or trailing commas?",
        answer:
          "No. DiffViewr validates strict JSON, so JSONC, JSON5, comments, and trailing commas are invalid."
      },
      {
        question: "Are duplicate JSON keys allowed if the browser parser keeps the last value?",
        answer:
          "No. DiffViewr checks for duplicates before parsing and marks the file invalid when the same key appears twice in one object."
      },
      {
        question: "Can the same key appear in two different nested JSON objects?",
        answer:
          "Yes. Scope matters for JSON. A key repeated in separate nested objects is valid."
      },
      {
        question: "Does array order matter?",
        answer:
          "Array values are not treated as duplicate keys. You can also enable the array reorder option when you want Target B arrays aligned to Template A."
      }
    ]
  },
  env: {
    key: "env",
    route: "/env-diff/",
    eyebrow: ".env diff",
    formatLabel: ".ENV",
    title: ".env Diff Tool",
    description:
      "Compare dotenv files as flat key-value config, review staging versus production changes, and catch duplicate environment variables.",
    intro: [
      ".env files look simple until a production override hides in a long list of variables.",
      "DiffViewr treats dotenv files as a flat global map, compares staging against production, and refuses duplicate variable names instead of accepting last-write-wins behavior."
    ],
    sampleCtaLabel: "Try Example",
    sampleTitle: "Staging versus production .env sample",
    sampleDescription:
      "The sample changes environment, API URL, log level, cache TTL, and includes a duplicate PAYMENT_PROVIDER line to demonstrate strict validation.",
    referenceLabel: ".env.staging",
    targetLabel: ".env.production",
    referenceSample: envReference,
    targetSample: envTarget,
    benefits: [
      {
        label: "Global scope",
        text: "Every variable name is checked across the whole file because dotenv config has no nested object scope."
      },
      {
        label: "No silent override",
        text: "Duplicate variables are invalid even if another tool would keep the last value."
      },
      {
        label: "Deployment review",
        text: "Staging and production values can be compared without uploading secrets to a server."
      }
    ],
    faqs: [
      {
        question: "Are duplicate .env variable names valid?",
        answer:
          "No. DiffViewr treats duplicate variable names anywhere in the file as invalid."
      },
      {
        question: "Does DiffViewr understand export KEY=value lines?",
        answer:
          "Yes. Lines starting with export are accepted when they follow the KEY=VALUE shape."
      },
      {
        question: "How are comments handled in .env files?",
        answer:
          "Blank lines and full-line comments are ignored. Inline text after the equals sign is treated as part of the value."
      },
      {
        question: "Does .env support nested paths in duplicate reports?",
        answer:
          "No. Dotenv files are flat, so duplicate reports show the variable name and line details without a JSON or YAML path."
      }
    ]
  }
};

export const formatLandingOrder: FormatLandingKey[] = ["yaml", "json", "env"];
