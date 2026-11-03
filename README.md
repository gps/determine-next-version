# Determine Next Version GitHub Action

This action looks at git tags in a repository that begin with `v`, and are of format `x.y.z`, where `x`, `y`, and `z` are integers that represent the major, minor, and patch versions respectively. It then sets an output with `x.y.z+1`.

## Inputs

### `gh_token`

The GitHub token used to authenticate with GitHub.

**Required**

### `tag_prefix`

Prefix to look for in version tags.

**Required**

**Default Value** 

If unspecified, assumed to be `v`.

## Outputs

### `next_build_version`

Next build version to use.

## Example Usage

The action uses Node.js 24. Self-hosted runners must support the `node24` action runtime (runner v2.327.1 or later).
The token needs `contents: read` permission to list repository tags.

```yml
- name: Determine next version
  uses: gps/determine-next-version@master
  id: next_version
  with:
    GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    TAG_PREFIX: v

- name: Tag commit
  uses: gps/tag_commit@master
  with:
    GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    TAG_NAME: v${{steps.next_version.outputs.NEXT_BUILD_VERSION}}
```

## Development

Use asdf to install the Node.js version pinned in `.tool-versions`. CI reads the same file:

```sh
asdf install
npm ci
npm audit
npm run build
```

The pull request workflow uses `gps/ncc-gha@master` to build and commit generated `dist/` changes back to the branch. The action runs this bundled distribution without installing dependencies.
CI also audits dependencies. Dependabot checks npm packages and workflow actions weekly.
