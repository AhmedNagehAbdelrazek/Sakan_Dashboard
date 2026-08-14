let token: string | null = null;

export const tokenHolder = {
  set(value: string | null) {
    token = value;
  },

  get(): string | null {
    return token;
  },

  clear() {
    token = null;
  },
};

