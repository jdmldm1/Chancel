#!/bin/bash
# Script to migrate Apollo Client to graphql-request

FILES=$(find /home/jdmldm/code/BibleProject/apps/web/app -name "*.tsx" -type f | grep -v dashboard)

for file in $FILES; do
  # Check if file uses Apollo Client
  if grep -q "@apollo/client" "$file"; then
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
  fi
done

echo "Migration complete!"
