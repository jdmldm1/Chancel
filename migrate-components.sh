#!/bin/bash
# Script to migrate Apollo Client to graphql-request in components

FILES="/home/jdmldm/code/BibleProject/apps/web/components/session/AssignGroupsToSession.tsx
/home/jdmldm/code/BibleProject/apps/web/components/session/SessionResources.tsx
/home/jdmldm/code/BibleProject/apps/web/components/session/CommentSection.tsx
/home/jdmldm/code/BibleProject/apps/web/components/session/SessionChat.tsx
/home/jdmldm/code/BibleProject/apps/web/components/session/SessionList.tsx
/home/jdmldm/code/BibleProject/apps/web/components/session/CommentItem.tsx
/home/jdmldm/code/BibleProject/apps/web/components/session/JoinByCodeModal.tsx
/home/jdmldm/code/BibleProject/apps/web/components/session/JoinRequestManager.tsx
/home/jdmldm/code/BibleProject/apps/web/components/session/VerseByVersePassage.tsx
/home/jdmldm/code/BibleProject/apps/web/components/session/SessionForm.tsx
/home/jdmldm/code/BibleProject/apps/web/components/session/MyJoinRequests.tsx
/home/jdmldm/code/BibleProject/apps/web/components/session/JoinCodeDisplay.tsx
/home/jdmldm/code/BibleProject/apps/web/components/series/AssignGroupsToSeries.tsx"

for file in $FILES; do
  echo "Updating: $file"

  # Replace Apollo Client imports
  sed -i "s/import { useQuery } from '@apollo\/client\/react'/import { useGraphQLQuery } from '@\/lib\/graphql-client-new'/g" "$file"
  sed -i "s/import { useMutation } from '@apollo\/client\/react'/import { useGraphQLMutation } from '@\/lib\/graphql-client-new'/g" "$file"
  sed -i "s/import { useQuery, useMutation } from '@apollo\/client\/react'/import { useGraphQLQuery, useGraphQLMutation } from '@\/lib\/graphql-client-new'/g" "$file"
  sed -i "s/import { useMutation, useQuery } from '@apollo\/client\/react'/import { useGraphQLQuery, useGraphQLMutation } from '@\/lib\/graphql-client-new'/g" "$file"

  # Remove gql imports
  sed -i "/import { gql } from '@apollo\/client'/d" "$file"

  # Replace gql template strings with regular template strings
  sed -i 's/gql`/`/g' "$file"

  # Replace useQuery with useGraphQLQuery
  sed -i 's/useQuery</useGraphQLQuery</g' "$file"
  sed -i 's/useQuery(/useGraphQLQuery(/g' "$file"

  # Replace useMutation with useGraphQLMutation
  sed -i 's/useMutation</useGraphQLMutation</g' "$file"
  sed -i 's/useMutation(/useGraphQLMutation(/g' "$file"
done

echo "Component migration complete!"
