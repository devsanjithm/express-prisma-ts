const resConverter = (obj: object | null): { status: boolean; data: object | null } => {
  return {
    status: true,
    data: obj ?? null
  };
};

export default resConverter;
