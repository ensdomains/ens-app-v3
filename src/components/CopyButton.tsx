import { useCopied } from "@app/hooks/useCopied";
import { Box, Button } from "@ensdomains/thorin";
import { IconCopyAnimated } from "./IconCopyAnimated";

export const CopyButton = ({ value }: { value: string }) => {
  const { copy, copied } = useCopied();

  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      <Button
        onClick={() => copy(value)}
        size="extraSmall"
        variant="transparent"
        shadowless
      >
        <IconCopyAnimated copied={copied} size="3.5" />
      </Button>
    </Box>
  );
};
