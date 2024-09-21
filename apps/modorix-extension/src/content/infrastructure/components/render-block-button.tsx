import '@modorix-ui/globals.css';
import { createRoot } from 'react-dom/client';
import { DependenciesProvider } from '../../../shared/infrastructure/dependencies-provider';
import { BlockReasonDialog } from './block-reason-dialog';

export function renderBlockButton(
  buttonsContainer: HTMLElement,
  linkElement: HTMLAnchorElement,
  confirmBlock: (blockReasonIds: string[]) => void,
) {
  const blockButtonContainer = document.createElement('div');
  blockButtonContainer!.id = 'modorix-root';
  const dialogContainer = document.createElement('div');
  dialogContainer!.id = 'modorix-root';
  buttonsContainer?.append(blockButtonContainer);
  document.body.append(dialogContainer);

  const splitedHref = linkElement.href.split('/');
  const username = splitedHref[splitedHref.length - 1];
  const root = createRoot(blockButtonContainer!);
  root.render(
    <DependenciesProvider>
      <BlockReasonDialog container={dialogContainer} username={username} onSubmit={confirmBlock} />
    </DependenciesProvider>,
  );
}
