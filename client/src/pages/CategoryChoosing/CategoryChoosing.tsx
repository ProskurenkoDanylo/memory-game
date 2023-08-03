import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { getTop10Categories, searchCategory } from '../../api';

import NavBar from '../../components/layouts/NavBar';
import ButtonOrLink from '../../ui/ButtonOrLink/ButtonOrLink';
import Container from '../../ui/Container';
import Text from '../../ui/Text';
import Input from '../../ui/Input';

import * as S from './CategoryChoosing.style';
import { BiSearch } from 'react-icons/bi';

import GameConfig from '../../types/gameConfig';
import Category from '../../types/category';

function CategoryChoosing() {
  const navigate = useNavigate();
  const [categorySearch, setCategorySearch] = useState('');
  const [categories, setCategories] = useState<any>();
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);

  useEffect(() => {
    const configString = localStorage.getItem('config');
    if (configString !== null) {
      setGameConfig(JSON.parse(configString));
    }
    if (!configString) {
      localStorage.setItem('config', '');
      navigate('/');
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      return await getTop10Categories()
        .then((res) => res.json())
        .then((data) => setCategories(data));
    };
    fetchData();
  }, []);

  const fetchSearchCategories = async () => {
    if (!categorySearch) {
      return await getTop10Categories().then((res) => res.json());
    }
    return await searchCategory(categorySearch).then((res) => res.json());
  };

  const searchCategories = async () => {
    const results = await fetchSearchCategories();
    setCategories(results);
  };

  const setCategory = (category: string) => {
    const updatedConfig = { ...gameConfig, category };
    setGameConfig(updatedConfig);
    localStorage.setItem('config', JSON.stringify(updatedConfig));
    navigate('/game');
  };

  const quickStart = () => {
    const updatedConfig = { ...gameConfig, category: 'Category' };
    setGameConfig(updatedConfig);
    localStorage.setItem('config', JSON.stringify(updatedConfig));
    navigate('/game');
  };

  return (
    <>
      <NavBar />
      <main>
        <Container>
          <h1>Choose category</h1>
          <Input
            value={categorySearch}
            placeholder="Your search query here"
            name="category"
            onChange={(e) => setCategorySearch(e.target.value)}
            onBlur={searchCategories}
            onKeyDown={(e) =>
              e.key === 'Enter' && (e.target as HTMLInputElement).blur()
            }
            endIcon={<BiSearch />}
          />
          {categories && categories.length ? (
            <S.Categories>
              {categories.slice(0, 8).map((el: Category) => (
                <S.Category key={el._id} onClick={() => setCategory(el._id)}>
                  <img src={el.mainImage} alt={`${el.title} category image.`} />
                </S.Category>
              ))}
            </S.Categories>
          ) : (
            <Text alignment="center">No categories found.</Text>
          )}
          <Text alignment="center">OR</Text>
          <S.Centered>
            <ButtonOrLink $colors="#135151" onClick={quickStart}>
              Random
            </ButtonOrLink>
          </S.Centered>
        </Container>
      </main>
    </>
  );
}

export default CategoryChoosing;
