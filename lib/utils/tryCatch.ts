export async function tryCatch(
  onResolve: () => Promise<any>,
  onReject: (e: unknown) => void,
  onSettled = () => {}
) {
  try {
    await onResolve();
  } catch (e) {
    onReject(e);
  } finally {
    onSettled();
  }
}
