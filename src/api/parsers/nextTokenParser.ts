/**
 * pass element as item of array of contents[] that possibly hold next continuation tokens
 * @param element any
 * @returns string
 */
export const parseNextToken = (element: any): string => {
  let token = '';
  try {
    if ('continuationItemViewModel' in element) {
      token =
        element.continuationItemViewModel?.continuationCommand?.innertubeCommand
          ?.continuationCommand?.token ?? '';
    } else if ('continuationItemRenderer' in element) {
      const continuationEndpoint = element.continuationItemRenderer?.continuationEndpoint;
      if ('continuationCommand' in continuationEndpoint) {
        token = continuationEndpoint.continuationCommand?.token ?? '';
      } else if ('commandExecutorCommand' in continuationEndpoint) {
        token =
          continuationEndpoint.commandExecutorCommand?.commands[1]?.continuationCommand?.token ??
          '';
      }
    }
  } catch (error) {
    console.log('parseNextToken Error :: ', (error as Error).message);
  }
  return token;
};
